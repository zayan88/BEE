import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="منتج جديد" subtitle="أنشئ صفحة هبوط جديدة" />
      <ProductForm />
    </>
  );
}
