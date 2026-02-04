import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
const Toaster = () => {
  const { theme = "system" } = useTheme();
  return (
    <Sonner
      position="bottom-right"
      theme={theme as "system" | "light" | "dark"}
      toastOptions={{
        classNames: {
          toast: "rounded-xl px-4 py-3 shadow-lg font-medium",
          title: "font-semibold",
          description: "text-sm opacity-80",
        },
      }}
    />
  );
};
export { Toaster, toast };
