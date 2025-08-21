#!/usr/bin/env python3
"""
Video Compression Script for Africana Ventures Website
This script helps compress large video files to improve website loading speed.
"""

import os
import sys
from pathlib import Path

def compress_video(input_path, output_path, target_size_mb=5):
    """
    Compress video to target size using ffmpeg (if available)
    """
    try:
        # Check if ffmpeg is available
        import subprocess
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ FFmpeg found! Compressing {input_path}...")
            
            # Calculate target bitrate based on target size
            # Rough estimation: bitrate = (target_size * 8) / duration
            cmd = [
                'ffmpeg', '-i', input_path,
                '-c:v', 'libx264',  # H.264 codec
                '-crf', '28',       # Constant Rate Factor (18-28 is good quality)
                '-preset', 'medium', # Encoding preset
                '-c:a', 'aac',      # Audio codec
                '-b:a', '128k',     # Audio bitrate
                '-movflags', '+faststart',  # Optimize for web
                '-y',               # Overwrite output file
                output_path
            ]
            
            subprocess.run(cmd, check=True)
            print(f"✅ Video compressed successfully!")
            print(f"📁 Output: {output_path}")
            
            # Show file sizes
            original_size = os.path.getsize(input_path) / (1024 * 1024)
            compressed_size = os.path.getsize(output_path) / (1024 * 1024)
            compression_ratio = (1 - compressed_size / original_size) * 100
            
            print(f"📊 Original: {original_size:.1f}MB")
            print(f"📊 Compressed: {compressed_size:.1f}MB")
            print(f"📊 Compression: {compression_ratio:.1f}%")
            
        else:
            print("❌ FFmpeg not found. Please install FFmpeg first.")
            print("📥 Download from: https://ffmpeg.org/download.html")
            
    except ImportError:
        print("❌ FFmpeg not available. Please install FFmpeg first.")
        print("📥 Download from: https://ffmpeg.org/download.html")
    except Exception as e:
        print(f"❌ Error compressing video: {e}")

def main():
    print("🎬 Africana Ventures Video Compression Tool")
    print("=" * 50)
    
    # Check current video files
    video_dir = Path("Frontend/static/videos")
    if not video_dir.exists():
        print("❌ Videos directory not found!")
        return
    
    print("\n📁 Current video files:")
    video_files = list(video_dir.glob("*.mp4")) + list(video_dir.glob("*.webm"))
    
    if not video_files:
        print("❌ No video files found!")
        return
    
    for video in video_files:
        size_mb = video.stat().st_size / (1024 * 1024)
        print(f"  • {video.name}: {size_mb:.1f}MB")
    
    print("\n🚀 Recommendations:")
    print("  • hero-bg.mp4 (28MB) → Compress to <5MB")
    print("  • hero-bg1.mp4 (11MB) → Compress to <3MB")
    print("  • Keep hero-bg.webm (654KB) - already optimized!")
    
    print("\n💡 To compress videos manually:")
    print("  1. Install FFmpeg: https://ffmpeg.org/download.html")
    print("  2. Run: ffmpeg -i hero-bg.mp4 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k hero-bg-compressed.mp4")
    print("  3. Replace original files with compressed versions")
    
    # Try to compress if ffmpeg is available
    hero_video = video_dir / "hero-bg.mp4"
    if hero_video.exists():
        compressed_path = video_dir / "hero-bg-compressed.mp4"
        print(f"\n🔧 Attempting to compress {hero_video.name}...")
        compress_video(str(hero_video), str(compressed_path))

if __name__ == "__main__":
    main()




