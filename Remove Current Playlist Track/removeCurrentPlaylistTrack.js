(function () {
    const EXT_VERSION = "v1.7.0";

    console.log(`[RemoveCurrentPlaylistTrack] Loaded (${EXT_VERSION})`);

    if (window.__removeTrackExtensionLoaded) return;
    window.__removeTrackExtensionLoaded = true;

    function setupListener() {
        if (!Spicetify?.Player || !Spicetify?.Platform?.PlaylistAPI) {
            setTimeout(setupListener, 300);
            return;
        }

        console.log("[RemoveCurrentPlaylistTrack] Spicetify APIs ready. Keyboard listener active.");

        window.addEventListener("keydown", async function (event) {
            if (event.key !== "Delete" && event.code !== "Delete") return;
            if (event.repeat) return;

            const activeEl = document.activeElement;
            if (
                activeEl &&
                (activeEl.tagName === "INPUT" ||
                 activeEl.tagName === "TEXTAREA" ||
                 activeEl.isContentEditable)
            ) {
                return;
            }

            const player = Spicetify.Player.data;
            if (!player) return;

            const currentContextUri = player.context?.uri;
            if (!currentContextUri || !currentContextUri.startsWith("spotify:playlist:")) {
                Spicetify.showNotification("Not currently playing from a playlist.");
                return;
            }

            const trackUri = player.item?.uri;
            const playerUid = player.item?.uid;
            const trackName = player.item?.name || "Unknown Track";

            if (!trackUri) {
                Spicetify.showNotification("No active track found to remove.");
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            try {
                // Fetch full metadata for the active playlist
                const playlist = await Spicetify.Platform.PlaylistAPI.getPlaylist(currentContextUri);
                const metadata = playlist?.metadata;
                const playlistName = metadata?.name || "this playlist";

                const isEditable = metadata?.isOwnedBySelf || (metadata?.canRemove && metadata?.canEditItems);

                if (!isEditable) {
                    Spicetify.showNotification(`Cannot edit "${playlistName}" (not owned by you).`);
                    return;
                }

                const items = playlist?.contents?.items || [];
                const matchingRows = items.filter(row => row.uri === trackUri);

                if (matchingRows.length === 0) {
                    Spicetify.showNotification(`Track not found in "${playlistName}".`);
                    return;
                }

                let targetRow = null;

                if (matchingRows.length === 1) {
                    targetRow = matchingRows[0];
                } else {
                    if (playerUid) {
                        targetRow = matchingRows.find(row => row.uid === playerUid);
                    }

                    if (!targetRow) {
                        Spicetify.showNotification(`Cannot safely delete: "${trackName}" appears multiple times.`);
                        return;
                    }
                }

                const confirmed = window.confirm(`Remove "${trackName}" from "${playlistName}"?`);
                if (!confirmed) return;

                await Spicetify.Platform.PlaylistAPI.remove(currentContextUri, [{
                    uid: targetRow.uid,
                    uri: targetRow.uri
                }]);

                Spicetify.showNotification(`Removed "${trackName}" from "${playlistName}"!`);
                console.log(`[RemoveCurrentPlaylistTrack] Successfully removed row UID ${targetRow.uid} from ${playlistName}`);

            } catch (err) {
                console.error("[RemoveCurrentPlaylistTrack] Removal error:", err);
                Spicetify.showNotification("Failed to remove track. Check console for details.");
            }
        }, true);
    }

    setupListener();
})();