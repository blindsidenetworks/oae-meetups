# Meetups
This is an OAE backend module that provides integration with [BigBlueButton](http://bigbluebutton.org/)
and allows group meetups (through web conferencing) in OAE.

See https://github.com/oaeproject/Hilary if you'd like to use it.


## Before installing oae-meetups:
Ensure that you are using the modified [3akai-ux](https://github.com/blindsidenetworks/3akai-ux)
repo that has the oae-meetups ui.

The modified 3akai-ux repo follows the same setup and installation instructions
available [here](https://github.com/oaeproject/Hilary).



## Installing oae-meetups module into OAE:
Meetups is installed by cloning this repo into the node_modules folder in the Hilary backend.

Move into your OAE directory (with 3akai & Hilary folders) and do
```
  cd ~/Hilary/node_modules
  git clone https://github.com/blindsidenetworks/oae-meetups
  npm install -d
```

If there are any missing dependencies listed when starting oae do `npm install missing-dependency`
in node_modules folder (_missing-depedency_ is the name of the missing dependency)

After all dependencies are installed, run oae as usual and there should be a newly
listed 'OAE BigBlueButton Module' under configuration for admins.



## Setup OAE to use meetups:
Meetups is disabled by default and can be enabled for tenants by the admin.

To quickly enable for *ALL* tenants, simply enter configuration without specifically
editing a tenant and select **_Enable conferencing with BigBlueButton_**

**Note:** You can enable for a *single* tenant by entering configuration after selecting a
  tenant to edit

Next you need to enter your BigBlueButton server URL and shared secret value.  
These values can be found by running `bbb-conf --secret` in the bbb server console.

Copy the resulting URL value to the URL field and Secret value to the Secret field.

### Configurations
The next few options are for configurating meetups based on group manager needs:

**Enable recording capability** - specifies whether or not the recording feature in meetups is available

**Recording capability enabled by default in new meetings** - specifies whether or not recording is enabled by default in meetups

**Enable all moderator capability** - specifies whether or not all moderator features are available

**All moderator capability enabled by default in new meetings** - specifies whether or not all moderator capability is enabled by default

**Default visibility for a new meeting** - specifies which tenant group can access the meetup

**Note:** don't forget to save the configuration!



## Using meetups in OAE
Group managers can start a meetup by creating a group and selecting the meetup option on the menu and
regular group members can join the meetup in the same manner.

Moderators of the meetup are users in the group who have _MANAGER_ access and regular users
are those listed as having _MEMBER_ access in the 'Members' tab of the group.
