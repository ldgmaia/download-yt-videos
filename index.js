const ytdl = require('ytdl-core')
const fs = require('fs')
const readline = require('readline')
const ffmpeg = require('fluent-ffmpeg')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

async function downloadYouTubeVideoWithAudio(url, outputPath) {
  try {
    const videoInfo = await ytdl.getInfo(url)

    const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: 'highestvideo',
      filter: 'videoonly',
    })
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: 'highestaudio',
      filter: 'audioonly',
    })

    if (!videoFormat || !audioFormat) {
      console.error('Could not find highest video or audio format.')
      rl.close()
      return
    }

    // Define temporary file paths
    const videoPath = 'temp_video.mp4'
    const audioPath = 'temp_audio.mp3'

    // Download video and audio separately
    await Promise.all([
      new Promise((resolve, reject) => {
        ytdl(url, { format: videoFormat })
          .pipe(fs.createWriteStream(videoPath))
          .on('finish', resolve)
          .on('error', reject)
      }),
      new Promise((resolve, reject) => {
        ytdl(url, { format: audioFormat })
          .pipe(fs.createWriteStream(audioPath))
          .on('finish', resolve)
          .on('error', reject)
      }),
    ])

    // Merge video and audio using complex filter
    const command = ffmpeg()
    const commandArray = []

    command.input(videoPath)
    command.input(audioPath)
    commandArray.push('[1]volume=1.0[a1]') // Adjust volume if needed
    let ffmpegKeys = '[a1]anull[a]'
    commandArray.push(ffmpegKeys)

    command
      .complexFilter(commandArray)
      .addOptions(['-map 0:v', '-map [a]', '-c:v copy'])
      .format('mp4')
      .on('end', () => {
        console.log(`Video with audio downloaded successfully to ${outputPath}`)
        // Cleanup temporary files
        fs.unlinkSync(videoPath)
        fs.unlinkSync(audioPath)
        rl.close()
      })
      .on('error', (err) => {
        console.error('Error merging video and audio:', err)
        rl.close()
      })
      .save(outputPath)
  } catch (error) {
    console.error('Error:', error)
    rl.close()
  }
}

async function downloadYouTubeAudio(url, outputPath) {
  try {
    const audioInfo = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(audioInfo.formats, {
      quality: 'highestaudio',
      filter: 'audioonly',
    })

    if (!format) {
      console.error('No suitable audio format found.')
      return
    }

    const audioStream = ytdl(url, { format: format })
    const writeStream = fs.createWriteStream(outputPath)

    audioStream.pipe(writeStream)

    writeStream.on('finish', () => {
      console.log(`Audio downloaded successfully to ${outputPath}`)
      rl.close()
    })

    writeStream.on('error', (err) => {
      console.error('Error downloading audio:', err)
      rl.close()
    })

    audioStream.on('error', (err) => {
      console.error('ytdl stream error', err)
      rl.close()
    })
  } catch (error) {
    console.error('Error getting audio info:', error)
    rl.close()
  }
}

async function main() {
  const downloadType = await prompt(
    'Do you want to download video or audio? (video/audio): '
  )
  const videoUrl = await prompt('Enter the YouTube video URL: ')
  // const outputFilePath = await prompt(
  //   'Enter the desired output file path (e.g., video.mp4 or audio.mp3): '
  // )

  const videoInfo = await ytdl.getInfo(videoUrl)
  const videoTitle = videoInfo.videoDetails.title.replace(/[<>:"/\\|?*]+/g, '') // Remove invalid characters
  const outputFilePath = `${videoTitle}.mp4`
  console.log(`Saving as: ${outputFilePath}`)

  if (downloadType.toLowerCase() === 'video') {
    await downloadYouTubeVideoWithAudio(videoUrl, outputFilePath)
  } else if (downloadType.toLowerCase() === 'audio') {
    await downloadYouTubeAudio(videoUrl, outputFilePath)
  } else {
    console.log('Invalid download type.')
    rl.close()
  }
}

main()
