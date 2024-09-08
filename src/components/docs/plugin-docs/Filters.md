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
   - Demo
   - Streamable
   - Steam Features
   - Achievements
   - MicroSD Card (Requires MicroSDeck)

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
<img title="Collection Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_collection-example.png" />

<br/>

#### Installed
**Options:**<br/>
`installed` - A toggle. On is `installed`, off is `uninstalled`.

**Behavior:**<br/>
Filters apps based on their install state.

**Example:**<br/>
<img title="Installed Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_installed-example.png" />

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
<img title="Friends Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_friends-example.png" />

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
<img title="Tags Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_tags-example.png" />

<br/>

#### Whitelist
**Options:**<br/>
`apps` - A list of apps to whitelist.

**Behavior:**<br/>
Filters apps by if they are in the list.

**Example:**<br/>
<img title="Whitelist Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_whitelist-example.png" />

<br/>

#### Blacklist
**Options:**<br/>
`apps` - A list of apps to blacklist.

**Behavior:**<br/>
Filters apps by if they are not in the list.

**Example:**<br/>
<img title="Blacklist Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_blacklist-example.png" />

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
<img title="Regex Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_regex-example.png" />

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
<img title="Merge Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_merge-example.png" />

<br/>

#### Platform
**Options:**<br/>
`platform` - The desired platform, either Steam or Non Steam.

**Behavior:**<br/>
Filters apps based on their platform.

**Example:**<br/>
<img title="Platform Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_platform-example.png" />

<br/>

#### Deck Compatability
**Options:**<br/>
`compatability level` - The desired compatability level, either "Verified", "Playable", "Unsupported", or "Unkown".
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
Filters apps based on their Steam Deck compatability.

**Example:**<br/>
<img title="Deck Compat Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_deck-compat-example.png" />

<br/>

#### Review Score
**Options:**<br/>
`score` - The desired review score.
`type` - The desired review type to use, Metacritic or Steam.
`greater/less` - Whether to include apps that have a review score greater than or equal to the provided score, or less than or equal to it.

**Behavior:**<br/>
Filters apps based on their review score.

**Example:**<br/>
<img title="Review Score Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_review-score-example.png" />

<br/>

#### Time Played
**Options:**<br/>
`play time` - The desired amount of time in the selected interval.
`time interval` - The time interval to use, "minutes", "hours", or "days".
`greater/less` - Whether to include apps that are greater than or equal to the provided score, or less than or equal to it.

**Behavior:**<br/>
Filters apps based on your time spent playing them.

**Example:**<br/>
<img title="Time Played Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_time-played-example.png" />

<br/>

#### Size on Disk
**Options:**<br/>
`size` - The desired size of apps to include.
`greater/less` - Whether to include apps that are greater than or equal to the provided score, or less than or equal to it.

**Behavior:**<br/>
Filters apps based on their size.

**Example:**<br/>
<img title="Size on Disk Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_size-on-disk-example.png" />

<br/>

#### Release Date
**Options:**<br/>
`date` - The desired release date of apps to include.
`time period` - Whether you want to specify only the year, just the month and year, or the day, month, and year.
`before/after` - Whether to include apps that were released before or after the provided date.

**Behavior:**<br/>
Filters apps based on their release date.

**Example:**<br/>
<img title="Release Date Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_release-date-example.png" />

<br/>

#### Purchase Date
**Options:**<br/>
`date` - The desired purchase date of apps to include.
`time period` - Whether you want to specify only the year, just the month and year, or the day, month, and year.
`before/after` - Whether to include apps that were purchased before or after the provided date.

**Behavior:**<br/>
Filters apps based on their purchase date.

**Example:**<br/>
<img title="Purchase Date Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_purchase-date-example.png" />

<br/>

#### Last Played
**Options:**<br/>
`date` - The desired last played date of apps to include.
`time period` - Whether you want to specify only the year, just the month and year, or the day, month, and year.
`before/after` - Whether to include apps that were last played before or after the provided date.

**Behavior:**<br/>
Filters apps based on when they were last played.

**Example:**<br/>
<img title="Last Played Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_last-played-example.png" />

<br/>

#### Family Sharing
**Options:**<br/>
`Is from family member` - Whether to only include games that are shared from a family member, or only those that aren't.

**Behavior:**<br/>
Filters apps based on if they are a shared by a family member or not.

**Example:**<br/>
<img title="Family Sharing Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_family-sharing-example.png" />

<br/>

#### Demo
**Options:**<br/>
`Is demo` - Whether to only include games that are demos, or only those that aren't.

**Behavior:**<br/>
Filters apps based on if they are a demo or not.

**Example:**<br/>
<img title="Demo Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_demo-example.png" />

<br/>

#### Streamable
**Options:**<br/>
`Is Streamable` - Whether to only include games that can be streamed, or only those that can't.

**Behavior:**<br/>
Filters apps based on if they can be streamed or not.

**Example:**<br/>
<img title="Streamable Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_streamable-example.png" />

<br/>

#### Steam Features
**Options:**<br/>
`features` - A list of Steam features.
`logic mode` - Specifies whether to use `and` vs. `or` mode.
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
- `and`: Filters apps based on if they have all listed features.
- `or`: Filters apps based on if they have any listed features.

**Example:**<br/>
<img title="Steam Features Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_steam-features-example.png" />

<br/>

#### Achievements
**Options:**<br/>
`percentage` - The desired achievement percentage completion (or count) of apps to include.
`greater/less` - Whether to include apps that have an achievement completion percentage greater than or equal to the provided percentage, or less than or equal to it.
`Type` - Whether to use filter by the number of unlocked achievements, or the completion percentage

**Behavior:**<br/>
Filters apps based on their achievement completion percentage or count.

**Example:**<br/>
<img title="Achievements Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_achievements-example.png" />

<br/>

#### MicroSD Card (Requires MicroSDeck)
**Options:**<br/>
`MicroSD card` - The MicroSD card to use (if none are showing up, make sure they are showing up in MicroSDeck).
`inverted` - If true, inverts the filtered apps (exclued apps are now included, and vis versa).

**Behavior:**<br/>
Filters apps based on if they are installed on the specified MicroSD card.

**Example:**<br/>
<img title="MicroSD Card Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/filters/docs_microsd-card-example.png" />

<br/>


###### © Travis Lane (Tormak), Jessebofill
