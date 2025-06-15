/**
 * Supabase Edge Function: export-saft-pt
 * Gera o ficheiro SAF-T(PT) XML com base nos dados das tabelas de faturação, clientes e produtos.
 * Ajuste conforme necessário para adaptar os selects ao seu modelo completo.
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { xml2js, js2xml } from "npm:xml-js";

// SAF-T header params (ajuste conforme necessário)
const headerStatic = {
  AuditFileVersion: "1.04_01",
  CompanyName: "Empresa Exemplo",
  CompanyAddress: { // Ajuste com dados reais
    AddressDetail: "Rua Exemplo, 123",
    City: "Lisboa",
    PostalCode: "1000-000",
    Country: "PT"
  },
  FiscalYear: "", // Preencher conforme ano das faturas exportadas
  TaxRegistrationNumber: "",
  CurrencyCode: "EUR",
  DateCreated: new Date().toISOString(),
  SoftwareCertificateNumber: "0", // '0' se não certificado, troque pelo número ao certificar
  ProductCompanyTaxID: "",
  ProductID: "rollbox-accounting",
  ProductVersion: "1.0.0"
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Parâmetros
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year") || new Date().getFullYear();

  // Ligação segura ao Supabase
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Buscar dados principais
  const [{ data: invoices }, { data: clients }, { data: products }] = await Promise.all([
    supabase.from("invoices").select("*").gte("issue_date", `${year}-01-01`).lte("issue_date", `${year}-12-31`),
    supabase.from("clients").select("*"),
    supabase.from("products").select("*"),
  ]);

  // Buscar dados da empresa (company_settings)
  const { data: companySettings } = await supabase.from("company_settings").select("*").maybeSingle();

  // Mapear Company Info no header
  const header = {
    ...headerStatic,
    CompanyName: companySettings?.company_name || "Empresa",
    TaxRegistrationNumber: companySettings?.tax_number || "",
    CompanyAddress: {
      AddressDetail: companySettings?.address || "",
      City: companySettings?.city || "",
      PostalCode: companySettings?.postal_code || "",
      Country: companySettings?.country || "PT"
    },
    FiscalYear: `${year}`,
    ProductCompanyTaxID: companySettings?.tax_number || "",
  };

  // SAF-T structure
  const saft = {
    AuditFile: {
      _attributes: { xmlns: "urn:OECD:StandardAuditFile-Tax:PT_1.04_01" },
      Header: header,
      MasterFiles: {
        Customer: (clients || []).map((c: any) => ({
          CustomerID: c.id,
          AccountID: c.id,
          CustomerTaxID: c.tax_number || "",
          CompanyName: c.name,
          BillingAddress: {
            AddressDetail: c.address || "",
            City: c.city || "",
            PostalCode: c.postal_code || "",
            Country: c.country || "PT"
          }
        })),
        Product: (products || []).map((p: any) => ({
          ProductType: (p.is_service ? "S" : "P"),
          ProductCode: p.id,
          ProductDescription: p.name,
          ProductNumberCode: p.id
        }))
      },
      // Simplificado: só faturas (aprimorar para recibos e outros docs)
      SourceDocuments: {
        SalesInvoices: {
          NumberOfEntries: invoices?.length || 0,
          TotalCredit: (invoices || []).reduce((sum, i: any) => sum + Number(i.total_amount || 0), 0),
          Invoice: (invoices || []).map((inv: any) => ({
            InvoiceNo: inv.invoice_number,
            InvoiceDate: inv.issue_date,
            CustomerID: inv.client_id,
            DocumentStatus: {
              InvoiceStatus: inv.status?.toUpperCase() || "N/A",
              InvoiceStatusDate: inv.updated_at,
              SourceID: inv.user_id,
              SourceBilling: "P" // Presume Normal, especifique conforme tipo
            },
            Line: [
              // Detalhes linha (sugestão: buscar invoice_items, aqui simplificado)
              {
                ProductCode: "",
                ProductDescription: "",
                Quantity: 1,
                UnitPrice: Number(inv.total_amount || 0), // Coloque correto por item
                CreditAmount: Number(inv.total_amount || 0)
              }
            ],
            DocumentTotals: {
              TaxPayable: Number(inv.tax_amount || 0),
              NetTotal: Number(inv.subtotal || 0),
              GrossTotal: Number(inv.total_amount || 0)
            }
          }))
        }
      }
    }
  };

  // Gerar XML
  const xmlOptions = { compact: true, spaces: 2 };
  const xmlString = js2xml(saft, xmlOptions);

  // Validação básica do XML (apenas formato, não XSD)
  let isValid = false;
  try {
    xml2js(xmlString, { compact: true });
    isValid = true;
  } catch {
    return new Response("Erro: XML gerado inválido.", { status: 500, headers: corsHeaders });
  }

  // Return download
  return new Response(xmlString, {
    status: isValid ? 200 : 400,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/xml",
      "Content-Disposition": `attachment; filename="SAFT-${year}.xml"`
    }
  });
});
