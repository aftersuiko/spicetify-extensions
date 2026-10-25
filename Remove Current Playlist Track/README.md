# Remove Current Playlist Track

A lightweight [Spicetify](https://spicetify.app/) extension for Spotify Desktop that allows you to instantly remove the currently playing track from the active playlist using the `Ctrl + Delete` key.

---

## 🌟 Features

- 🎹 **Simple Keyboard Control**: Press the plain `Ctrl + Delete` or `Shift + Delete` key to remove the currently playing song from the playlist it is playing from.
- 🛡️ **Safety Guard**: 
  - Never triggers while typing inside search bars, input fields, or editable text areas.
  - Checks ownership/edit permissions before deletion.
  - Duplicate track protection: uses unique playlist row UIDs so it won't arbitrarily delete the wrong instance of a duplicate song.
- 💬 **Interactive Confirmation**: Prompts for confirmation showing the track name and target playlist before executing the removal.
- ⚡ **Lightweight**: Zero external dependencies, standalone JavaScript extension using native Spicetify APIs.

---

## 📥 Installation

### Method 1: Manual Installation

1. Download or copy `removeCurrentPlaylistTrack.js`.
2. Move `removeCurrentPlaylistTrack.js` into your Spicetify Extensions directory:
   - **Windows**: `%APPDATA%\spicetify\Extensions\`
   - **Linux / macOS**: `~/.config/spicetify/Extensions/`

3. Register and apply the extension via terminal / PowerShell:
   ```bash
   spicetify config extensions removeCurrentPlaylistTrack.js
   spicetify apply

🚀 How to Use:
1. Play any song from a playlist you own or have permission to edit.
2. Press the Delete key.
3. A native confirmation prompt will ask if you want to remove the track from the active playlist.
4. Click OK, and the track will be removed with a success notification.

💡 Note: If the currently playing track is from a playlist you do not own, or a non-playlist source (like Radio or Daily Mixes), a friendly notification will inform you that the action cannot be performed.

⚙️ How It Works
1. This extension leverages Spicetify's internal Spicetify.Platform.PlaylistAPI and Spicetify.Player context data. When the Delete key event fires, it:
2. Inspects the player context URI (spotify:playlist:...).
3. Checks playlist metadata permissions (isOwnedBySelf, canRemove, canEditItems).
4. Matches the playing track URI and uid against internal playlist contents.
5. Invokes PlaylistAPI.remove(playlistUri, [{ uid, uri }]) upon user confirmation.
