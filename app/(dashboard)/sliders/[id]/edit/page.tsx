import EditSliderForm from "@/components/ui/EditSliderForm";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  return (
    <div className="py-8">
      <EditSliderForm sliderId={id} />
    </div>
  );
}
