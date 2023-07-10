## Filters

### Table of Contents
 - Overview
 - Inverting Filters
 - Grouping Filters
   - Purpose
   - How it Works
   - Example
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

<br/>


### Overview

Below you will find information on the options and behavior of each filter, as well as an example of how to use it. Keep in mind that while most of the examples simply show how the filter is used on its own, each filter can be combined together to create very complexed selections. The `merge filter` example demonstrates this

<br/>

### Inverting Filters

Most filters have an option to invert them. This can be used to do the exact opposite of what the filter would normally do!<br/>
Example: Inverting a `Collection` filter would cause it to include any games **not in** that collection, instead of **in** it.

<br/>

### Grouping Filters

#### Purpose

Now why would we want to group filters? Well, the main use case for this is to change the `logic mode`. By grouping filters you are able to specify the mode for filters in the group seperately, significantly increasing the utility of TabMaster!

<br/>

#### How it Works

In order to do this, add a filter and change the type to `merge`. This will change the options to a single button that will open a new dialog for you to edit the group's contents. In here you can add filters and set the logic mode just like a tab, and even add more groups.

<br/>

#### Example

If that sounded a little confusing, don't worry. Here's an example of a filter group in action.
<!-- TODO: Image -->

<br/>

### Available Filters

#### Collection

**Options:**<br/>
`collection` - The collection to use.

**Behavior:**<br/>
Filters games based on if they are included in the collection.

**Example:**<br/>
<!-- TODO: Image -->

<br/>

#### Installed

**Options:**<br/>
`installed` - A toggle. On is `installed`, off is `uninstalled`.

**Behavior:**<br/>
Filters games based on their install state.

**Example:**<br/>
<!-- TODO: Image -->

<br/>

#### Friends

**Options:**<br/>
`friends` - A list of your users in your Steam Friends list.
`logic mode` - Specifies whether to use `and` vs. `or` mode.

**Behavior:**<br/>
- `and`: Filters games based on if they are owned by all listed friends.
- `or`: Filters games based on if they are owned by any listed friend.

**Example:**<br/>
<!-- TODO: Image -->

<br/>

#### Community Tags

**Options:**<br/>
`tags` - A list of community tags.
`logic mode` - Specifies whether to use `and` vs. `or` mode.

**Behavior:**<br/>
- `and`: Filters games based on if they have all listed tags.
- `or`: Filters games based on if they have any listed tag.

**Example:**<br/>
<!-- TODO: Image -->

<br/>

#### Whitelist

**Options:**<br/>
`games` - A list of games to whitelist.

**Behavior:**<br/>
Filters games by if they are in the list.

**Example:**<br/>
<!-- TODO: Image -->

<br/>

#### Blacklist

**Options:**<br/>
`games` - A list of games to blacklist.

**Behavior:**<br/>
Filters games by if they are not in the list.

**Example:**<br/>
<!-- TODO: Image -->

<br/>

#### Platform

**Options:**<br/>
`platform` - The platform to use.

**Behavior:**<br/>
Filters games based on if they are from the platform.

**Example:**<br/>
<!-- TODO: Image -->

<br/>

#### Deck Compatibility

**Options:**<br/>
`level` - The level of playability on the Steam Deck.

**Behavior:**<br/>
Filters games based on their level of playability on the Steam Deck.

**Example:**<br/>
<!-- TODO: Image -->

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
<!-- TODO: Image -->

<br/>


###### © Travis Lane (Tormak), Jessebofill
