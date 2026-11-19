import bgLogin from '../assets/img/bg-login.svg';

export default function AuthBanner({
  badge = 'Plataforma Segura',
  title = 'Tu voz, tu decisión.',
  subtitle = 'Participa en votaciones y encuestas en tiempo real con total transparencia.',
}) {
  return (
    <div
      className="hidden md:flex w-1/2 rounded-[2.5rem] relative overflow-hidden items-end p-12 lg:p-16 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900"
      style={{
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-12 left-12 w-12 h-12 border-8 border-white/80 rounded-full"></div>

      <div className="relative z-10 w-full">
        <span className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-widest border border-white/30 uppercase">
          {badge}
        </span>
        <h1 className="text-5xl lg:text-6xl font-bold text-white mt-6 mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-indigo-100 text-xl lg:text-2xl max-w-lg drop-shadow-md">
          {subtitle}
        </p>
      </div>
    </div>
  );
}