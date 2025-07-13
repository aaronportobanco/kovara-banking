import Image from "next/image";

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-1 z-10 px-4 cursor-pointer ${className}`}>
      <Image
        src="/logo/favicon-dark.svg"
        alt="Logo de Kovara"
        width={18}
        height={27}
      />
      <span className="text-foreground text-base font-bold leading-7 tracking-[-0.08px]">
        Kovara
      </span>
    </div>
  );
};

export default Logo;