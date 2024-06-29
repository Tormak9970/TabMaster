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

declare module "*/docs.codegen" {
  const content: DocPages;
  export default content;
}

type Unregisterer = {
  unregister: () => void;
}

type DocPages = {
  [key: string]: string
}

type UsersDict = {
  [userId: string]: {
    tabs: TabSettingsDictionary,
    friends: FriendEntry[],
    friendsGames: Map<number, number[]>
  }
}
