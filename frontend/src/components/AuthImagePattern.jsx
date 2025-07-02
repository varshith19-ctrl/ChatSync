const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div
      className="hidden lg:flex items-center justify-center bg-base-200 p-12"
      aria-label="Authentication Visual Pattern Section" //  Added for accessibility
      role="region" //  Added to define this as a landmark region
    >
      <div className="max-w-md text-center">
        <div
          className="grid grid-cols-3 gap-3 mb-8"
          aria-hidden="true" //  Hides decorative visuals from screen readers
        >
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
              aria-hidden="true" //  Ensures each animated block is ignored by screen readers
              loading="lazy" //  Simulates lazy loading (applies if replaced with <img>)
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4" tabIndex={0}> {/*  Allows keyboard focus */}
          {title}
        </h2>
        <p className="text-base-content/60" tabIndex={0}> {/*  Allows keyboard focus */}
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
