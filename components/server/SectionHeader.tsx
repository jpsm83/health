interface SectionHeaderProps {
  title: string;
  description?: string;
}

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="text-center bg-gradient-left-right p-4 md:p-8">
      <h2
        className="text-3xl font-bold text-white mb-2 md:mb-4 font-[Open_Sans]"
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
        }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-lg text-white max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}
