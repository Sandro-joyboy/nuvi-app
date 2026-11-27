// Partilhado entre o layout (Server Component) e as preferências do cliente.
export const THEME_KEY = "nuvi-theme";

/** Corre antes da página pintar: aplica o tema guardado sem flash. */
export const THEME_BOOT_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_KEY}")||"system";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){}})();`;
