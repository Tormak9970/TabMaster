import { Module, findModuleChild } from "decky-frontend-lib";

export type SoundEffect =
  "bumper_end.wav" |
  "confirmation_negative.wav" |
  "confirmation_positive.wav" |
  "deck_ui_achievement_toast.wav" |
  "deck_ui_bumper_end_02.wav" |
  "deck_ui_default_activation.wav" |
  "deck_ui_hide_modal.wav" |
  "deck_ui_into_game_detail.wav" |
  "deck_ui_launch_game.wav" |
  "deck_ui_message_toast.wav" |
  "deck_ui_misc_01.wav" |
  "deck_ui_misc_08.wav" |
  "deck_ui_misc_10.wav" |
  "deck_ui_navigation.wav" |
  "deck_ui_out_of_game_detail.wav" |
  "deck_ui_show_modal.wav" |
  "deck_ui_side_menu_fly_in.wav" |
  "deck_ui_side_menu_fly_out.wav" |
  "deck_ui_slider_down.wav" |
  "deck_ui_slider_up.wav" |
  "deck_ui_switch_toggle_off.wav" |
  "deck_ui_switch_toggle_on.wav" |
  "deck_ui_tab_transition_01.wav" |
  "deck_ui_tile_scroll.wav" |
  "deck_ui_toast.wav" |
  "deck_ui_typing.wav" |
  "deck_ui_volume.wav" |
  "pop_sound.wav" |
  "steam_at_mention.m4a" |
  "steam_chatroom_notification.m4a" |
  "ui_steam_message_old_smooth.m4a" |
  "ui_steam_smoother_friend_join.m4a" |
  "ui_steam_smoother_friend_online.m4a";

export type SFXPath = `/sounds/${SoundEffect}`

export interface GamepadUIAudio {
  AudioPlaybackManager: AudioPlaybackManager;
}

export interface AudioPlaybackManager {
  PlayAudioURL: (path: SFXPath) => void;
}

export const GamepadUIAudio: GamepadUIAudio = findModuleChild((m: Module) => {
  if (typeof m !== "object") return undefined;
  for (let prop in m) {
    if (m[prop]?.GamepadUIAudio) {
      return m[prop].GamepadUIAudio;
    }
  }
});
