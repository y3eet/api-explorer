import { Palette } from "lucide-react";
import { useEffect } from "react";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

const SelectTheme = () => {
  const onThemeSelect = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("data-theme", theme);
  };
  useEffect(() => {
    const theme = localStorage.getItem("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  return (
    <div>
      <div className="dropdown dropdown-right dropdown-start">
        <div tabIndex={0} role="button" className="btn m-1 btn-sm btn-soft">
          <Palette size={18} />
        </div>
        <div
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm overflow-y-auto max-h-96"
        >
          <ul className="menu w-full">
            {themes.map((theme) => (
              <li className="w-full" key={theme}>
                <button
                  onClick={() => onThemeSelect(theme)}
                  className="btn w-full mb-4"
                  data-theme={theme}
                >
                  {theme}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectTheme;
