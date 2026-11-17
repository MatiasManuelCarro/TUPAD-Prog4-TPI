type SkeletonProps = {
  count?: number;
};

export const Skeleton = ({
  count = 6,
}: SkeletonProps) => {
  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
      "
      aria-label="Cargando productos"
    >
      {Array.from({
        length: count,
      }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-xl
            border
            border-app-border
            bg-app-surface
            shadow-sm
          "
        >
          <div
            className="
              aspect-video
              animate-pulse
              bg-app-background
            "
          />

          <div className="space-y-4 p-5">
            <div
              className="
                h-4
                w-1/3
                animate-pulse
                rounded
                bg-app-border
              "
            />

            <div
              className="
                h-6
                w-2/3
                animate-pulse
                rounded
                bg-app-border
              "
            />

            <div className="space-y-2">
              <div
                className="
                  h-4
                  w-full
                  animate-pulse
                  rounded
                  bg-app-border
                "
              />

              <div
                className="
                  h-4
                  w-3/4
                  animate-pulse
                  rounded
                  bg-app-border
                "
              />
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                pt-2
              "
            >
              <div
                className="
                  h-6
                  w-20
                  animate-pulse
                  rounded
                  bg-app-border
                "
              />

              <div
                className="
                  h-10
                  w-24
                  animate-pulse
                  rounded-lg
                  bg-app-border
                "
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};