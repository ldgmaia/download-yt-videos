# YouTube Best Quality Downloader and Merger

This Node.js project downloads the highest quality video (without audio) and audio streams from a YouTube video, and then merges them into a single file, resulting in the best possible quality video.

## Prerequisites

* Node.js (v14 or higher)
* npm or yarn
* ffmpeg (installed and added to your system's PATH)

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm i
    # or
    yarn
    ```

3.  **Ensure ffmpeg is installed:**

    This project uses ffmpeg for merging video and audio. Make sure you have ffmpeg installed and available in your system's PATH. You can download it from the official ffmpeg website: [https://ffmpeg.org/](https://ffmpeg.org/)

## Usage

1.  **Run the script:**

```bash
node  index.js
or
npm run dev
```

2.  **Follow the prompts:**

    * The script will first ask if you want to download the "video and audio" or "audio only".
    * Then, it will prompt you to enter the full YouTube video URL.
    * The script will then download the best quality video and audio streams, and merge them (if video and audio was selected).
    * The final file will be saved in the same directory as the script, using the YouTube video's title as the filename.

## Example Workflow
```bash
node index.js
Do you want to download video and audio, or just audio? (video/audio): video
Enter the YouTube video URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Downloading video...
Downloading audio...
Merging video and audio...
Download complete! File saved as: Rick Astley - Never Gonna Give You Up (Official Music Video).mp4
```

## Important Notes

* The script uses `ytdl-core` to download the video and audio streams.
* `fluent-ffmpeg` is used to merge the streams.
* The output filename will be the YouTube video's title.
* If you select audio only, only the audio will be downloaded and saved as a .mp3 file.
* Make sure you have a stable internet connection for downloading large files.
* The script attempts to download the best quality available, but the actual quality may vary depending on the video's available formats.
