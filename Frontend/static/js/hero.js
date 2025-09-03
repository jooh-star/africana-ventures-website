document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('.hero-video');
    let currentVideoIndex = 0;

    function playNextVideo() {
        const currentVideo = videos[currentVideoIndex];
        currentVideo.classList.remove('active');
        currentVideo.pause();
        currentVideo.currentTime = 0;

        currentVideoIndex = (currentVideoIndex + 1) % videos.length;

        const nextVideo = videos[currentVideoIndex];
        nextVideo.classList.add('active');
        nextVideo.play();
    }

    videos.forEach((video, index) => {
        video.addEventListener('ended', playNextVideo);
    });
});