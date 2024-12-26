import io
import speech_recognition as sr
from pydub import AudioSegment
from concurrent.futures import ThreadPoolExecutor

def transcribe_audio(audio_path, chunk_length_ms=30000):
    recognizer = sr.Recognizer()
    audio = AudioSegment.from_mp3(audio_path)
    total_duration = len(audio)
    full_transcription = ""

    def transcribe_chunk(audio_chunk):
        with io.BytesIO() as wav_io:
            audio_chunk.export(wav_io, format="wav")
            wav_io.seek(0)
            with sr.AudioFile(wav_io) as source:
                audio_text = recognizer.record(source)
                try:
                    return recognizer.recognize_google(audio_text, language='en-US')
                except sr.UnknownValueError:
                    return "Could not understand audio"
                except sr.RequestError as e:
                    return f"Could not request results from Google Speech Recognition service; {e}"

    with ThreadPoolExecutor() as executor:
        futures = []
        for start_ms in range(0, total_duration, chunk_length_ms):
            end_ms = min(start_ms + chunk_length_ms, total_duration)
            audio_chunk = audio[start_ms:end_ms]
            futures.append(executor.submit(transcribe_chunk, audio_chunk))

        for future in futures:
            text = future.result()
            if text:
                full_transcription += text + " "

    return full_transcription
