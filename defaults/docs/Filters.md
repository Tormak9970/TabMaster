## Filters

### Table of Contents
 - Overview
 - Inverting Filters
 - Available Filters
   - Collection
   - Installed
   - Friends
   - Community Tags
   - Whitelist
   - Blacklist
   - Platform
   - Deck Compatibility
   - Regex
   - Merge
   - Platform
   - Deck Compatability
   - Review Score
   - Time Played
   - Size on Disk
   - Release Date
   - Last Played

<br/>


### Overview
Below you will find information on the options and behavior of each filter, as well as an example of how to use it. Keep in mind that while most of the examples simply show how the filter is used on its own, each filter can be combined together to create very complexed selections. The `merge filter` example demonstrates this

<br/>

### Inverting Filters
Most filters have an option to invert them. This can be used to do the exact opposite of what the filter would normally do!<br/>
Example: Inverting a `Collection` filter would cause it to include any apps **not in** that collection, instead of **in** it.

<br/>


### Available Filters

#### Collection
**Options:**<br/>
`collection` - The collection to use.
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
Filters apps based on if they are included in the collection.

**Example:**<br/>
<img title="Collection Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_collection-example.png" />

<br/>

#### Installed
**Options:**<br/>
`installed` - A toggle. On is `installed`, off is `uninstalled`.

**Behavior:**<br/>
Filters apps based on their install state.

**Example:**<br/>
<img title="Installed Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_installed-example.png" />

<br/>

#### Friends
**Options:**<br/>
`friends` - A list of your users in your Steam Friends list.
`logic mode` - Specifies whether to use `and` vs. `or` mode.
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
- `and`: Filters apps based on if they are owned by all listed friends.
- `or`: Filters apps based on if they are owned by any listed friend.

**Example:**<br/>
<img title="Friends Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_friends-example.png" />

<br/>

#### Community Tags
**Options:**<br/>
`tags` - A list of community tags.
`logic mode` - Specifies whether to use `and` vs. `or` mode.
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
- `and`: Filters apps based on if they have all listed tags.
- `or`: Filters apps based on if they have any listed tag.

**Example:**<br/>
<img title="Tags Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_tags-example.png" />

<br/>

#### Whitelist
**Options:**<br/>
`apps` - A list of apps to whitelist.

**Behavior:**<br/>
Filters apps by if they are in the list.

**Example:**<br/>
<img title="Whitelist Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_whitelist-example.png" />

<br/>

#### Blacklist
**Options:**<br/>
`apps` - A list of apps to blacklist.

**Behavior:**<br/>
Filters apps by if they are not in the list.

**Example:**<br/>
<img title="Blacklist Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_blacklist-example.png" />

<br/>

#### Regex
**Options:**<br/>
`regex` - The regular expression to use.
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
Filters apps by testing if their title matches a regular expression .

**Tip:**<br/>
Regular expressions can seem daunting and confusing. You can test yours before hand by looking up a "Regex Tester" website.<br/>
Also, by typing a phrase like "Zelda" into the regex field, it will include any game with that phrase in its title.

**Example:**<br/>
<img title="Regex Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_regex-example.png" />

<br/>

#### Merge
**Options:**<br/>
`filters` - The filters for this group.
`logic mode` - Specifies whether to use `and` vs. `or` mode.
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
Groups a set of filters, allowing you to change the logic mode for smaller sets of filters.

**Tip:**<br/>
By grouping filters you are able to specify the mode for filters in the group seperately, significantly increasing the utility of TabMaster

**Example:**<br/>
<img title="Merge Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_merge-example.png" />

<br/>

#### Platform
**Options:**<br/>
`platform` - The desired platform, either Steam or Non Steam.

**Behavior:**<br/>
Filters apps based on their platform.

**Example:**<br/>
<img title="Platform Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_platform-example.png" />

<br/>

#### Deck Compatability
**Options:**<br/>
`compatability level` - The desired compatability level, either "Verified", "Playable", "Unsupported", or "Unkown".
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
Filters apps based on their Steam Deck compatability.

**Example:**<br/>
<img title="Deck Compat Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_deck-compat-example.png" />

<br/>

#### Review Score
**Options:**<br/>
`score` - The desired review score.
`type` - The desired review type to use, Metacritic or Steam.
`greater/less` - Wether to include apps that have a review score greater than or equal to the provided score, or less than or equal to it.

**Behavior:**<br/>
Filters apps based on their review score.

**Example:**<br/>
<img title="Review Score Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_review-score-example.png" />

<br/>

#### Time Played
**Options:**<br/>
`play time` - The desired amount of time in the selected interval.
`time interval` - The time interval to use, "minutes", "hours", or "days".
`greater/less` - Wether to include apps that are greater than or equal to the provided score, or less than or equal to it.

**Behavior:**<br/>
Filters apps based on your time spent playing them.

**Example:**<br/>
<img title="Time Played Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_time-played-example.png" />

<br/>

#### Size on Disk
**Options:**<br/>
`size` - The desired size of apps to include.
`greater/less` - Wether to include apps that are greater than or equal to the provided score, or less than or equal to it.

**Behavior:**<br/>
Filters apps based on their size.

**Example:**<br/>
<img title="Size on Disk Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_size-on-disk-example.png" />

<br/>

#### Release Date
**Options:**<br/>
`date` - The desired release date of apps to include.
`time period` - Whether you want to specify only the year, just the month and year, or the day, month, and year.
`before/after` - Wether to include apps that were released before or after the provided date.

**Behavior:**<br/>
Filters apps based on their release date.

**Example:**<br/>
<img title="Release Date Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_release-date-example.png" />

<br/>

#### Last Played
**Options:**<br/>
`date` - The desired last played date of apps to include.
`time period` - Whether you want to specify only the year, just the month and year, or the day, month, and year.
`before/after` - Wether to include apps that were last played before or after the provided date.

**Behavior:**<br/>
Filters apps based on when they were last played.

**Example:**<br/>
<img title="Last Played Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_last-played-example.png" />

<br/>


###### © Travis Lane (Tormak), Jessebofill
