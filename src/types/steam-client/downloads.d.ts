// Types for SteamClient.Downloads

type Downloads = {
  RegisterForDownloadItems: (callback: (isDownloading: boolean, downloadItems: DownloadItem[]) => void) => Unregisterer,
  RegisterForDownloadOverview: (callback: (data: DownloadOverview) => void) => Unregisterer,
}

type DownloadItem = {
  active: boolean,
  appid: number,
  buildid: number,
  completed: boolean,
  completed_time: number,
  deferred_time: number,
  downloaded_bytes: number,
  launch_on_completion: boolean,
  paused: boolean,
  queue_index: number,
  target_buildid: number,
  total_bytes: number,
  update_error: string,
  update_result: number,
  update_type_info: UpdateTypeInfo[]
}

type UpdateTypeInfo = {
  completed_update: boolean,
  downloaded_bytes: number,
  has_update: boolean,
  total_bytes: number
}

type DownloadOverview = {
  lan_peer_hostname: string,
  paused: boolean,
  throttling_suspended: boolean,
  update_appid: number,
  update_bytes_downloaded: number,
  update_bytes_processed: number,
  update_bytes_staged: number,
  update_bytes_to_download: number,
  update_bytes_to_process: number,
  update_bytes_to_stage: number,
  update_disc_bytes_per_second: number,
  update_is_install: boolean,
  update_is_prefetch_estimate: boolean,
  update_is_shader: boolean,
  update_is_upload: boolean,
  update_is_workshop: boolean,
  update_network_bytes_per_second: number,
  update_peak_network_bytes_per_second: number,
  update_seconds_remaining: number,
  update_start_time: number,
  update_state: "None" | "Starting" | "Updating" | "Stopping"
}

