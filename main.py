import asyncio
import os
import decky_plugin
from settings import SettingsManager
from typing import TypeVar, Dict, List


def log(txt):
  decky_plugin.logger.info(txt)

def warn(txt):
  decky_plugin.logger.warn(txt)

def error(txt):
  decky_plugin.logger.error(txt)

Initialized = False

class Plugin:
  user_id: str = None
  users_dict: Dict[str, dict] = None

  docsDirPath = f"{decky_plugin.DECKY_PLUGIN_DIR}/docs"
  docs = {}

  settings: SettingsManager

  async def logMessage(self, message, level):
    if level == 0:
      log(message)
    elif level == 1:
      warn(message)
    elif level == 2:
      error(message)

  # Plugin settings getters
  async def get_users_dict(self) -> Dict[str, dict] | None:
    """
    Waits until users_dict is loaded, then returns users_dict

    :return: The users dictionary
    """
    while Plugin.users_dict is None:
      await asyncio.sleep(0.1)
      
    # log(f"Got users_dict {Plugin.settings_dict}")
    return Plugin.users_dict
  
  async def set_active_user_id(self, user_id: str) -> bool:
    log(f"active user id: {user_id}")
    Plugin.user_id = user_id
    
    while Plugin.users_dict is None:
      await asyncio.sleep(0.1)

    if not user_id in Plugin.users_dict.keys():
      log(f"User {user_id} had no settings.")

      Plugin.users_dict[user_id] = {
        "tabs": {},
        "tags": [],
        "friends": [],
        "friendsGames": {}
      }
      await Plugin.set_setting(self, "usersDict", Plugin.users_dict)

      return True
    else:
      return False
  
  async def get_tabs(self) -> Dict[str, dict] | None:
    """
    Waits until tabs are loaded, then returns the tabs

    :return: The tabs
    """
    while Plugin.users_dict is None:
      await asyncio.sleep(0.1)
    
    tabs = Plugin.users_dict[Plugin.user_id]["tabs"]
    log(f"Got tabs {tabs}")
    return tabs or {}

  async def get_tags(self) -> List[dict] | None:
    """
    Waits until tags is loaded, then returns the tags

    :return: The tags
    """
    while Plugin.users_dict is None:
      await asyncio.sleep(0.1)
    
    tags = Plugin.users_dict[Plugin.user_id]["tags"]
    log(f"Got {len(tags)} tags")
    return tags or []

  async def get_friends(self) -> List[dict] | None:
    """
    Waits until friends is loaded, then returns the friends

    :return: The friends
    """
    while Plugin.users_dict is None:
      await asyncio.sleep(0.1)
      
    friends = Plugin.users_dict[Plugin.user_id]["friends"]
    log(f"Got {len(friends)} friends")
    return friends or []

  async def get_friends_games(self) -> Dict[int, List[int]] | None:
    """
    Waits until friends_games is loaded, then returns the friends_games

    :return: The friends_games
    """
    while Plugin.users_dict is None:
      await asyncio.sleep(0.1)

    friends_games = Plugin.users_dict[Plugin.user_id]["friendsGames"]  
    log(f"Got {len(friends_games)} friendsGames")
    return friends_games or {}

  # Plugin settings setters
  async def set_tabs(self, tabs: Dict[str, dict]):
    Plugin.users_dict[Plugin.user_id].tabs = tabs
    await Plugin.set_setting(self, "usersDict", Plugin.users_dict)

  async def set_tags(self, tags: List[dict]):
    Plugin.users_dict[Plugin.user_id].tags = tags
    await Plugin.set_setting(self, "usersDict", Plugin.users_dict)

  async def set_friends(self, friends: List[dict]):
    Plugin.users_dict[Plugin.user_id].friends = friends
    await Plugin.set_setting(self, "usersDict", Plugin.users_dict)

  async def set_friends_games(self, friends_games: Dict[str, List[int]]):
    Plugin.users_dict[Plugin.user_id].friendsGames = friends_games
    await Plugin.set_setting(self, "usersDict", Plugin.users_dict)

  async def get_docs(self):
    for docsFileName in os.listdir(self.docsDirPath):
      with open(os.path.join(self.docsDirPath, docsFileName), 'r') as docFile:
        docName = docsFileName.replace("_", " ").replace(".md", "")
        self.docs[docName] = "".join(docFile.readlines())

    return self.docs

  async def read(self) -> None:
    """
    Reads the json from disk
    """
    Plugin.settings.read()
    Plugin.users_dict = await Plugin.get_setting(self, "usersDict", {})

  T = TypeVar("T")

  # Plugin settingsManager wrappers
  async def get_setting(self, key, default: T) -> T:
    """
    Gets the specified setting from the json

    :param key: The key to get
    :param default: The default value
    :return: The value, or default if not found
    """
    return Plugin.settings.getSetting(key, default)

  async def set_setting(self, key, value: T) -> T:
    """
    Sets the specified setting in the json

    :param key: The key to set
    :param value: The value to set it to
    :return: The new value
    """
    Plugin.settings.setSetting(key, value)
    return value

  # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
  async def _main(self):
    global Initialized

    if Initialized:
      return

    Initialized = True

    Plugin.settings = SettingsManager(name="settings", settings_directory=os.environ["DECKY_PLUGIN_SETTINGS_DIR"])
    await Plugin.read(self)

    log("Initializing Tab Master.")

  # Function called first during the unload process, utilize this to handle your plugin being removed
  async def _unload(self):
    decky_plugin.logger.info("Unloading Tab Master.")

  # Migrations that should be performed before entering `_main()`.
  async def _migration(self):
    pass
