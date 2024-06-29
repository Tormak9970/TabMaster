// ? Module that does the rendering of these
// const StoreFeaturesModule = findModule((mod) => {
//   if (!mod) return undefined;
//   if (mod.RY && mod.V5) return mod;
// })

// StoreFeaturesModule.BA //* this links the k list to the corresponding store categories
// StoreFeaturesModule.V5 //* this links store category (type, category) to a string

// found via response from https://api.steampowered.com/IStoreBrowseService/GetStoreCategories/v1/?access_token=redacted&language=english
export const STEAM_FEATURES_ID_MAP = {
  "28": {
    "categoryid": 28,
    "type": 3,
    "internal_name": "Full Controller Support",
    "display_name": "Full controller support",
    "image_url": "public/images/v6/ico/ico_controller.png",
    "show_in_search": true
  },
  "18": {
    "categoryid": 18,
    "type": 3,
    "internal_name": "Controller enabled",
    "display_name": "Partial Controller Support",
    "image_url": "public/images/v6/ico/ico_partial_controller.png",
    "show_in_search": true
  },
  "2": {
    "categoryid": 2,
    "type": 1,
    "internal_name": "Single-player",
    "display_name": "Single-player",
    "image_url": "public/images/v6/ico/ico_singlePlayer.png",
    "show_in_search": true
  },
  "1": {
    "categoryid": 1,
    "type": 1,
    "internal_name": "Multi-player",
    "display_name": "Multi-player",
    "image_url": "public/images/v6/ico/ico_multiPlayer.png",
    "show_in_search": true
  },
  "20": {
    "categoryid": 20,
    "type": 1,
    "internal_name": "MMO",
    "display_name": "MMO",
    "image_url": "public/images/v6/ico/ico_multiPlayer.png"
  },
  "49": {
    "categoryid": 49,
    "type": 1,
    "internal_name": "PvP",
    "display_name": "PvP",
    "image_url": "public/images/v6/ico/ico_multiPlayer.png",
    "show_in_search": true
  },
  "36": {
    "categoryid": 36,
    "type": 1,
    "internal_name": "Online PvP",
    "display_name": "Online PvP",
    "image_url": "public/images/v6/ico/ico_multiPlayer.png",
    "show_in_search": true
  },
  "47": {
    "categoryid": 47,
    "type": 1,
    "internal_name": "LAN PvP",
    "display_name": "LAN PvP",
    "image_url": "public/images/v6/ico/ico_multiPlayer.png",
    "show_in_search": true
  },
  "3": {
    "categoryid": 37,
    "type": 1,
    "internal_name": "Shared/Split Screen PvP",
    "display_name": "Shared/Split Screen PvP",
    "image_url": "public/images/v6/ico/ico_multiPlayer.png",
    "show_in_search": true
  },
  "9": {
    "categoryid": 9,
    "type": 1,
    "internal_name": "Co-op",
    "display_name": "Co-op",
    "image_url": "public/images/v6/ico/ico_coop.png",
    "show_in_search": true
  },
  "38": {
    "categoryid": 38,
    "type": 1,
    "internal_name": "Online Co-op",
    "display_name": "Online Co-op",
    "image_url": "public/images/v6/ico/ico_coop.png",
    "show_in_search": true
  },
  "48": {
    "categoryid": 48,
    "type": 1,
    "internal_name": "LAN Co-op",
    "display_name": "LAN Co-op",
    "image_url": "public/images/v6/ico/ico_coop.png",
    "show_in_search": true
  },
  "39": {
    "categoryid": 39,
    "type": 1,
    "internal_name": "Shared/Split Screen Co-op",
    "display_name": "Shared/Split Screen Co-op",
    "image_url": "public/images/v6/ico/ico_coop.png",
    "show_in_search": true
  },
  "24": {
    "categoryid": 24,
    "type": 1,
    "internal_name": "Shared/Split Screen",
    "display_name": "Shared/Split Screen",
    "image_url": "public/images/v6/ico/ico_coop.png",
    "show_in_search": true
  },
  "27": {
    "categoryid": 27,
    "type": 1,
    "internal_name": "Cross-Platform Multiplayer",
    "display_name": "Cross-Platform Multiplayer",
    "image_url": "public/images/v6/ico/ico_multiPlayer.png",
    "show_in_search": true
  },
  "22": {
    "categoryid": 22,
    "type": 2,
    "internal_name": "Steam Achievements",
    "display_name": "Steam Achievements",
    "image_url": "public/images/v6/ico/ico_achievements.png",
    "show_in_search": true
  },
  "52": {
    "categoryid": 52,
    "type": 2,
    "internal_name": "Tracked Motion Controller",
    "display_name": "Tracked Controller Support",
    "image_url": "public/images/v6/ico/ico_vr_input_motion.png",
    "show_in_search": true
  },
  "53": {
    "categoryid": 53,
    "type": 2,
    "internal_name": "VR Supported",
    "display_name": "VR Supported",
    "image_url": "public/images/v6/ico/ico_vr_support.png"
  },
  "54": {
    "categoryid": 54,
    "type": 2,
    "internal_name": "VR Only",
    "display_name": "VR Only",
    "image_url": "public/images/v6/ico/ico_vr_support.png"
  },
  "29": {
    "categoryid": 29,
    "type": 2,
    "internal_name": "Steam Trading Cards",
    "display_name": "Steam Trading Cards",
    "image_url": "public/images/v6/ico/ico_cards.png",
    "show_in_search": true
  },
  "31": {
    "categoryid": 31,
    "type": 2,
    "internal_name": "VR Support",
    "display_name": "VR Support",
    "image_url": "public/images/v6/ico/VRIcon.png",
    "show_in_search": true
  },
  "30": {
    "categoryid": 30,
    "type": 2,
    "internal_name": "Steam Workshop",
    "display_name": "Steam Workshop",
    "image_url": "public/images/v6/ico/ico_workshop.png",
    "show_in_search": true
  },
  "51": {
    "categoryid": 51,
    "type": 2,
    "internal_name": "Steam China Workshop",
    "display_name": "Steam Workshop",
    "image_url": "public/images/v6/ico/ico_workshop.png",
    "show_in_search": true
  },
  "40": {
    "categoryid": 40,
    "type": 2,
    "internal_name": "SteamVR Collectibles",
    "display_name": "SteamVR Collectibles",
    "image_url": "public/images/v6/ico/ico_collectibles.png",
    "show_in_search": true
  },
  "35": {
    "categoryid": 35,
    "type": 2,
    "internal_name": "In-App Purchases",
    "display_name": "In-App Purchases",
    "image_url": "public/images/v6/ico/ico_cart.png"
  },
  "23": {
    "categoryid": 23,
    "type": 2,
    "internal_name": "Steam Cloud",
    "display_name": "Steam Cloud",
    "image_url": "public/images/v6/ico/ico_cloud.png",
    "show_in_search": true
  },
  "8": {
    "categoryid": 8,
    "type": 2,
    "internal_name": "VAC Enabled",
    "display_name": "Valve Anti-Cheat enabled",
    "image_url": "public/images/v6/ico/ico_vac.png",
    "show_in_search": true
  },
  "25": {
    "categoryid": 25,
    "type": 2,
    "internal_name": "Steam Leaderboards",
    "display_name": "Steam Leaderboards",
    "image_url": "public/images/v6/ico/ico_leaderboards.png"
  },
  "32": {
    "categoryid": 32,
    "type": 2,
    "internal_name": "Async Game Notifications",
    "display_name": "Steam Turn Notifications",
    "image_url": "public/images/v6/ico/ico_turn_notifications.png"
  },
  "41": {
    "categoryid": 41,
    "type": 2,
    "internal_name": "Remote Play on Phone",
    "display_name": "Remote Play on Phone",
    "image_url": "public/images/v6/ico/ico_remote_play.png",
    "show_in_search": true
  },
  "42": {
    "categoryid": 42,
    "type": 2,
    "internal_name": "Remote Play on Tablet",
    "display_name": "Remote Play on Tablet",
    "image_url": "public/images/v6/ico/ico_remote_play.png",
    "show_in_search": true
  },
  "43": {
    "categoryid": 43,
    "type": 2,
    "internal_name": "Remote Play on TV",
    "display_name": "Remote Play on TV",
    "image_url": "public/images/v6/ico/ico_remote_play.png",
    "show_in_search": true
  },
  "44": {
    "categoryid": 44,
    "type": 2,
    "internal_name": "Remote Play Together",
    "display_name": "Remote Play Together",
    "image_url": "public/images/v6/ico/ico_remote_play_together.png",
    "show_in_search": true
  },
  "61": {
    "categoryid": 61,
    "type": 2,
    "internal_name": "HDR",
    "display_name": "HDR available",
    "image_url": "public/images/v6/ico/ico_hdr.png",
    "show_in_search": true
  }
}

// * gotten from looking at the source code for "StoreFeaturesModule.V5".
export const STEAM_FEATURES_TO_RENDER = Object.keys(STEAM_FEATURES_ID_MAP).map((key) => parseInt(key));
