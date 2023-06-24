type Unregisterer = {
  unregister: () => void;
}

type TagResponse = {
  tag: number,
  string: string | undefined
}

type FriendEntry = {
  name: string,
  steamid: number
}