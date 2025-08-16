import type { APIRoute } from 'astro';


// Spotify API Endpoints
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// This is the main API route handler
export const GET: APIRoute = async () => {
  console.log("API route '/api/spotify.json' triggered.");

  try {
    // --- Environment Variable Check ---
    const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
    const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;

    // Log to check if variables are loaded (but don't log the secrets themselves!)
    console.log("SPOTIFY_CLIENT_ID loaded:", !!client_id);
    console.log("SPOTIFY_CLIENT_SECRET loaded:", !!client_secret);
    console.log("SPOTIFY_REFRESH_TOKEN loaded:", !!refresh_token);

    if (!client_id || !client_secret || !refresh_token) {
      console.error("CRITICAL: One or more Spotify environment variables are missing.");
      return new Response(JSON.stringify({ error: "Server configuration error." }), { status: 500 });
    }

    // --- Get Access Token ---
    console.log("Attempting to get access token from Spotify...");
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${client_id}:${client_secret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      })
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error(`Spotify Token API Error: ${tokenResponse.status} ${tokenResponse.statusText}`, errorBody);
      return new Response(JSON.stringify({ error: "Failed to authenticate with Spotify." }), { status: 502 }); // 502 Bad Gateway is appropriate here
    }

    const { access_token } = await tokenResponse.json();
    console.log("Successfully obtained access token.");

    // --- Fetch Now Playing ---
    console.log("Fetching currently playing song...");
    const nowPlayingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      console.log("Spotify is not playing anything or returned an error status.");
      return new Response(JSON.stringify({ isPlaying: false }), { status: 200 });
    }

    const song = await nowPlayingResponse.json();
    console.log("Successfully fetched song data.");

    const data = {
      isPlaying: song.is_playing,
      title: song.item?.name,
      artist: song.item?.artists.map((artist: any) => artist.name).join(', '),
      albumImageUrl: song.item?.album.images[0].url,
      songUrl: song.item?.external_urls.spotify,
      timestamp: song.progress_ms,
      duration: song.item?.duration_ms,
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error: any) {
    // This will catch any unexpected errors in the logic above
    console.error("A fatal error occurred in the API route:", error.message);
    console.error(error.stack);
    return new Response(JSON.stringify({ error: "An internal server error occurred." }), { status: 500 });
  }
};