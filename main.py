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

  tabs: Dict[str, dict] = None
  tags: List[dict] = None
  friends: List[dict] = None
  friends_games: Dict[str, List[int]] = None

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
  async def get_tabs(self) -> Dict[str, dict] | None:
    """
    Waits until tabs is loaded, then returns the tabs

    :return: The tabs
    """
    while Plugin.tabs is None:
      await asyncio.sleep(0.1)
      
    log(f"Got tabs {Plugin.tabs}")
    return Plugin.tabs

  async def get_tags(self) -> List[dict] | None:
    """
    Waits until tags is loaded, then returns the tags

    :return: The tags
    """
    while Plugin.tags is None:
      await asyncio.sleep(0.1)
      
    log(f"Got {len(Plugin.tags)} tags")
    return Plugin.tags

  async def get_friends(self) -> List[dict] | None:
    """
    Waits until friends is loaded, then returns the friends

    :return: The friends
    """
    while Plugin.friends is None:
      await asyncio.sleep(0.1)
      
    log(f"Got friends {Plugin.friends}")
    return Plugin.friends

  async def get_friends_games(self) -> Dict[int, List[int]] | None:
    """
    Waits until friends_games is loaded, then returns the friends_games

    :return: The friends_games
    """
    while Plugin.friends_games is None:
      await asyncio.sleep(0.1)
      
    log(f"Got friends_games {Plugin.friends_games}")
    return Plugin.friends_games

  # Plugin settings setters
  async def set_tabs(self, tabs: Dict[str, dict]):
    Plugin.tabs = tabs
    await Plugin.set_setting(self, "tabs", Plugin.tabs)

  async def set_tags(self, tags: List[dict]):
    Plugin.tags = tags
    await Plugin.set_setting(self, "tags", Plugin.tags)

  async def set_friends(self, friends: List[dict]):
    Plugin.friends = friends
    await Plugin.set_setting(self, "friends", Plugin.friends)

  async def set_friends_games(self, friends_games: Dict[str, List[int]]):
    Plugin.friends_games = friends_games
    await Plugin.set_setting(self, "friendsGames", Plugin.friends_games)

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
    Plugin.tabs = await Plugin.get_setting(self, "tabs", {})
    Plugin.tags = await Plugin.get_setting(self, "tags", [])
    Plugin.friends = await Plugin.get_setting(self, "friends", [])
    Plugin.friends_games = await Plugin.get_setting(self, "friendsGames", {})

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
