import { join } from "path";
import { fileURLToPath } from "url"

const rootPath = fileURLToPath(new URL("../..", import.meta.url));
const templatePath = join(rootPath, "templates");

export { templatePath };