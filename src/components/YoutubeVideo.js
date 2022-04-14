import React, { Component } from 'react'
import YouTube from 'react-youtube'

class YoutubeVideo extends Component {
  videoOnReady (event) {
    const player = event.target
    // this.setState({
    //   playerObj: player
    // })
    player.seekTo(50)
    console.log(event.target)
  }

  videoOnPlay (event) {
    const player = event.target
    /// console.log(player.getCurrentTime())
  }

  videoStateChange (event) {
    const player = event.target
    console.log(player.getCurrentTime())
  }



  render () {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 0
      }
    }
    const {videoId} = this.props
    return (
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={this.videoOnReady}
        onPlay={this.videoOnPlay}
        onStateChange={this.videoStateChange}
      />
    )
  }
}

export default YoutubeVideo
