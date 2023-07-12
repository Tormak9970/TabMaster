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

<br/>


### Overview
Below you will find information on the options and behavior of each filter, as well as an example of how to use it. Keep in mind that while most of the examples simply show how the filter is used on its own, each filter can be combined together to create very complexed selections. The `merge filter` example demonstrates this

<br/>

### Inverting Filters
Most filters have an option to invert them. This can be used to do the exact opposite of what the filter would normally do!<br/>
Example: Inverting a `Collection` filter would cause it to include any games **not in** that collection, instead of **in** it.

<br/>


### Available Filters

#### Collection
**Options:**<br/>
`collection` - The collection to use.

**Behavior:**<br/>
Filters games based on if they are included in the collection.

**Example:**<br/>
<img title="Collection Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_collection-example.png" />

<br/>

#### Installed
**Options:**<br/>
`installed` - A toggle. On is `installed`, off is `uninstalled`.

**Behavior:**<br/>
Filters games based on their install state.

**Example:**<br/>
<img title="Installed Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_installed-example.png" />

<br/>

#### Friends
**Options:**<br/>
`friends` - A list of your users in your Steam Friends list.
`logic mode` - Specifies whether to use `and` vs. `or` mode.

**Behavior:**<br/>
- `and`: Filters games based on if they are owned by all listed friends.
- `or`: Filters games based on if they are owned by any listed friend.

**Example:**<br/>
<img title="Friends Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_friends-example.png" />

<br/>

#### Community Tags
**Options:**<br/>
`tags` - A list of community tags.
`logic mode` - Specifies whether to use `and` vs. `or` mode.

**Behavior:**<br/>
- `and`: Filters games based on if they have all listed tags.
- `or`: Filters games based on if they have any listed tag.

**Example:**<br/>
<img title="Tags Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_tags-example.png" />

<br/>

#### Whitelist
**Options:**<br/>
`games` - A list of games to whitelist.

**Behavior:**<br/>
Filters games by if they are in the list.

**Example:**<br/>
<img title="Whitelist Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_whitelist-example.png" />

<br/>

#### Blacklist
**Options:**<br/>
`games` - A list of games to blacklist.

**Behavior:**<br/>
Filters games by if they are not in the list.

**Example:**<br/>
<img title="Blacklist Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_blacklist-example.png" />

<br/>

#### Platform
**Options:**<br/>
`platform` - The platform to use.

**Behavior:**<br/>
Filters games based on if they are from the platform.

**Example:**<br/>
<img title="Platform Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_platform-example.png" />

<br/>

#### Deck Compatibility
**Options:**<br/>
`level` - The level of playability on the Steam Deck.

**Behavior:**<br/>
Filters games based on their level of playability on the Steam Deck.

**Example:**<br/>
<img title="Compat Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_compat-example.png" />

<br/>

#### Regex
**Options:**<br/>
`regex` - The regular expression to use.

**Behavior:**<br/>
Filters games by testing if their title matches a regular expression .

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

**Behavior:**<br/>
Groups a set of filters, allowing you to change the logic mode for smaller sets of filters.

**Tip:**<br/>
By grouping filters you are able to specify the mode for filters in the group seperately, significantly increasing the utility of TabMaster

**Example:**<br/>
<img title="Merge Example" src="https://raw.githubusercontent.com/tormak9970/TabMaster/master/assets/docs_merge-example.png" />

<br/>


###### © Travis Lane (Tormak), Jessebofill
