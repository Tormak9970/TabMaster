import asyncio
import logging
from typing import TypeVar, Dict, List

from settings import SettingsManager

logging.basicConfig(filename="/tmp/tabmaster.log",
                    format='[TabMaster] %(asctime)s %(levelname)s %(message)s',
                    filemode='w+',
                    force=True)
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # can be changed to logging.DEBUG for debugging issues


class Plugin:
    tabs: Dict[str, dict] = None
    hidden_tabs: List[str] = None
    settings: SettingsManager

    async def _main(self):
        Plugin.settings = SettingsManager("tabmaster")
        await Plugin.read(self)
        Plugin.tabs = await Plugin.get_setting(self, "tabs", {})
        Plugin.hidden_tabs = await Plugin.get_setting(self, "hidden_tabs", [])

    async def _unload(self):
        await Plugin.set_setting(self, "tabs", Plugin.tabs)
        await Plugin.set_setting(self, "hidden_tabs", Plugin.hidden_tabs)

    async def get_tabs(self) -> Dict[str, dict] | None:
        """
        Waits until tabs is loaded, then returns the tabs

        :return: The tabs
        """
        while Plugin.tabs is None:
            await asyncio.sleep(0.1)
        logger.debug(f"Got tabs {Plugin.tabs}")
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
        logger.debug(f"Got hidden tabs {Plugin.hidden_tabs}")
        return Plugin.hidden_tabs

    async def set_hidden_tabs(self, tabs: List[str]):
        Plugin.hidden_tabs = tabs
        await Plugin.set_setting(self, "hidden_tabs", Plugin.hidden_tabs)

    async def read(self) -> None:
        """
        Reads the json from disk
        """
        Plugin.settings.read()

    async def commit(self) -> None:
        """
        Commits the json to disk
        """
        Plugin.settings.commit()

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
