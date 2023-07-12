declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

type Unregisterer = {
  unregister: () => void;
}

type DocPages = {
  [key: string]: string
}
