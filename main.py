import asyncio
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
  hidden_tabs: List[str] = None
  settings: SettingsManager

  async def logMessage(self, message, level):
    if level == 0:
      log(message)
    elif level == 1:
      warn(message)
    elif level == 2:
      error(message)

  async def get_tabs(self) -> Dict[str, dict] | None:
    """
    Waits until tabs is loaded, then returns the tabs

    :return: The tabs
    """
    while Plugin.tabs is None:
      await asyncio.sleep(0.1)
      
    log(f"Got tabs {Plugin.tabs}")
    return Plugin.tabs

  async def set_tabs(self, tabs: Dict[str, dict]):
    Plugin.tabs = tabs
    await Plugin.set_setting(self, "tabs", Plugin.tabs)

  async def get_hidden_tabs(self) -> List[str] | None:
    """
    Waits until tabs is loaded, then returns the tabs

    :return: The tabs
    """
    while Plugin.hidden_tabs is None:
      await asyncio.sleep(0.1)
    log(f"Got hidden tabs {Plugin.hidden_tabs}")
    return Plugin.hidden_tabs

  async def set_hidden_tabs(self, tabs: List[str]):
    Plugin.hidden_tabs = tabs
    await Plugin.set_setting(self, "hidden_tabs", Plugin.hidden_tabs)

  async def read(self) -> None:
    """
    Reads the json from disk
    """
    Plugin.settings.read()
    Plugin.tabs = await Plugin.get_setting(self, "tabs", {})
    Plugin.hidden_tabs = await Plugin.get_setting(self, "hidden_tabs", [])

  async def commit(self) -> None:
    """
    Commits the json to disk
    """
    Plugin.settings.commit()
    await Plugin.set_setting(self, "tabs", Plugin.tabs)
    await Plugin.set_setting(self, "hidden_tabs", Plugin.hidden_tabs)

  T = TypeVar("T")

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

    Plugin.settings = SettingsManager("tabmaster")
    await Plugin.read(self)

    log("Initializing Tab Master.")

  # Function called first during the unload process, utilize this to handle your plugin being removed
  async def _unload(self):
    decky_plugin.logger.info("Unloading Tab Master.")
    await Plugin.commit(self)

  # Migrations that should be performed before entering `_main()`.
  async def _migration(self):
    pass
