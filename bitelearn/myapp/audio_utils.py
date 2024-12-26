import os
import yt_dlp
from pydub import AudioSegment

def download_audio(video_url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'writethumbnail': False,
        'noplaylist': True,
        'quiet': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(video_url, download=True)
            ext = info_dict['ext']
            filename = ydl.prepare_filename(info_dict).replace(f'.{ext}', f'.mp3')
        return filename
    except Exception as e:
        print(f"An error occurred during download: {e}")
        return None



# import os
# import yt_dlp
# from pydub import AudioSegment
#
# def download_audio(video_url, output_path):
#     # Ensure the output directory exists
#     if not os.path.exists(output_path):
#         os.makedirs(output_path)
#
#     # Options for yt-dlp
#     ydl_opts = {
#         'format': 'bestaudio/best',  # Download the best available audio
#         'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),  # Output path and filename template
#         'postprocessors': [{
#             'key': 'FFmpegExtractAudio',  # Extract audio using FFmpeg
#             'preferredcodec': 'mp3',  # Convert to mp3 format
#             'preferredquality': '192',  # Set audio quality
#         }],
#         'writethumbnail': False,  # Don't write thumbnails
#         'noplaylist': True,  # Don't download playlists, only single videos
#         'quiet': False,  # Change this to True if you don't want any logging output
#     }
#
#     try:
#         with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#             # Extract video info and download
#             info_dict = ydl.extract_info(video_url, download=True)
#             # Get the original file extension
#             ext = info_dict['ext']
#             # Prepare the filename and replace the extension to .mp3
#             filename = ydl.prepare_filename(info_dict).replace(f'.{ext}', f'.mp3')
#             print(f"Downloaded and converted to MP3: {filename}")
#         return filename
#
#     except yt_dlp.DownloadError as e:
#         # Catch specific yt-dlp download errors
#         print(f"Download error: {e}")
#         return None
#     except Exception as e:
#         # Catch all other errors
#         print(f"An error occurred during download: {e}")
#         return None
