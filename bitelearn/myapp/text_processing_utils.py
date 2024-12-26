# import string
# import traceback
# import pke
# import random
# import torch
# import numpy as np
# from nltk.tokenize import sent_tokenize
# from nltk.corpus import stopwords
# from collections import OrderedDict
# from nltk.corpus import wordnet as wn
# from flashtext import KeywordProcessor
# from sense2vec import Sense2Vec
# from sklearn.metrics.pairwise import cosine_similarity
# from sentence_transformers import SentenceTransformer
# from transformers import T5ForConditionalGeneration, T5Tokenizer
#
# # Load models
# summary_model = T5ForConditionalGeneration.from_pretrained('t5-base')
# summary_tokenizer = T5Tokenizer.from_pretrained("t5-small", legacy=False)
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# summary_model = summary_model.to(device)
#
# question_model = T5ForConditionalGeneration.from_pretrained('ramsrigouthamg/t5_squad_v1')
# question_tokenizer = T5Tokenizer.from_pretrained('ramsrigouthamg/t5_squad_v1', legacy=False)
# question_model = question_model.to(device)
# s2v = Sense2Vec().from_disk('s2v_old')
# sentence_transformer_model = SentenceTransformer('msmarco-distilbert-base-v3')
#
#
# def postprocesstext(content):
#     final = ""
#     for sent in sent_tokenize(content):
#         sent = sent.capitalize()
#         final = final + " " + sent
#     return final.strip()
#
#
# def summarizer(text, model, tokenizer):
#     text = "summarize: " + text.strip().replace("\n", " ")
#     max_len = 512
#     encoding = tokenizer.encode_plus(text, max_length=max_len, pad_to_max_length=False, truncation=True,
#                                      return_tensors="pt").to(device)
#     input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]
#     outs = model.generate(
#         input_ids=input_ids,
#         attention_mask=attention_mask,
#         early_stopping=True,
#         num_beams=3,
#         num_return_sequences=1,
#         no_repeat_ngram_size=2,
#         min_length=150,
#         max_length=500
#     )
#     summary = tokenizer.decode(outs[0], skip_special_tokens=True)
#     return postprocesstext(summary)
#
#
# def get_nouns_multipartite(content):
#     out = []
#     try:
#         extractor = pke.unsupervised.MultipartiteRank()
#         extractor.load_document(input=content, language='en')
#         pos = {'PROPN', 'NOUN'}
#         stoplist = list(string.punctuation) + stopwords.words('english')
#         extractor.candidate_selection(pos=pos)
#         extractor.candidate_weighting(alpha=1.1, threshold=0.75, method='average')
#         keyphrases = extractor.get_n_best(n=20)
#         out = [val[0] for val in keyphrases]
#     except:
#         traceback.print_exc()
#     return out
#
#
# def get_keywords(originaltext, summarytext):
#     keywords = get_nouns_multipartite(originaltext)
#     keyword_processor = KeywordProcessor()
#     for keyword in keywords:
#         keyword_processor.add_keyword(keyword)
#     keywords_found = list(set(keyword_processor.extract_keywords(summarytext)))
#     return [keyword for keyword in keywords if keyword in keywords_found][:10]
#
#
# def get_question(context, answer, model, tokenizer):
#     text = "context: {} answer: {}".format(context, answer)
#     encoding = tokenizer.encode_plus(text, max_length=384, pad_to_max_length=False, truncation=True,
#                                      return_tensors="pt").to(device)
#     input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]
#     outs = model.generate(input_ids=input_ids, attention_mask=attention_mask, early_stopping=True, num_beams=5,
#                           num_return_sequences=1, no_repeat_ngram_size=2, max_length=72)
#     return tokenizer.decode(outs[0], skip_special_tokens=True).replace("question:", "").strip()
#
#
# def sense2vec_get_words(word, s2v, topn, question):
#     output = []
#     try:
#         sense = s2v.get_best_sense(word)
#         most_similar = s2v.most_similar(sense, n=topn)
#         base_sense = sense.split('|')[1]
#         output = [eachword[0].split('|')[0].replace("_", " ").title().strip() for eachword in most_similar if
#                   eachword[0].split('|')[1] == base_sense]
#     except:
#         output = []
#     return [word for word in output if word.lower() not in question.lower()]
#
#
# def wordnet_get_synonyms(word):
#     synonyms = []
#     for syn in wn.synsets(word):
#         for lemma in syn.lemmas():
#             synonym = lemma.name().replace('_', ' ').title()
#             if synonym.lower() != word.lower():
#                 synonyms.append(synonym)
#     return list(OrderedDict.fromkeys(synonyms))
#
#
# def mmr(doc_embedding, word_embeddings, words, top):
#     if not words:
#         return []
#     scores = cosine_similarity(doc_embedding.reshape(1, -1), word_embeddings).flatten()
#     scores = scores / scores.sum()
#     mmr_scores = []
#     for i in range(len(words)):
#         mmr_scores.append((words[i], scores[i]))
#     mmr_scores.sort(key=lambda x: x[1], reverse=True)
#     return [word for word, score in mmr_scores[:top]]
#
#
# def generate_questions(text, n=10):
#     summary = summarizer(text, summary_model, summary_tokenizer)
#     print("Generated Summary:\n", summary)
#     keywords = get_keywords(text, summary)
#     questions = []
#     generated_questions = set()
#
#     for keyword in keywords:
#         question = get_question(summary, keyword, question_model, question_tokenizer)
#
#         if question in generated_questions:
#             continue
#
#         distractors = sense2vec_get_words(keyword, s2v, 50, question)
#         distractors.extend(wordnet_get_synonyms(keyword))
#         distractors = mmr(sentence_transformer_model.encode(question), sentence_transformer_model.encode(distractors),
#                           distractors, 3)
#
#         if len(distractors) < 3:
#             distractors = wordnet_get_synonyms(keyword)[:3] + sense2vec_get_words(keyword, s2v, 50, question)[:3]
#
#         if len(distractors) < 3:
#             continue
#
#         options = distractors[:3] + [keyword]
#         random.shuffle(options)
#
#         questions.append({"question": question, "options": options, "answer": keyword})
#         generated_questions.add(question)
#
#         if len(questions) >= n:
#             break
#
#     return questions


import os
import yt_dlp
from pydub import AudioSegment
import speech_recognition as sr
import io
from concurrent.futures import ThreadPoolExecutor
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
import string
import pke
import traceback
from flashtext import KeywordProcessor
from sense2vec import Sense2Vec
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from collections import OrderedDict
from nltk.corpus import wordnet as wn
import random
import numpy as np

# import shutil
#
# # Clear the NLTK data directory
# shutil.rmtree(nltk.data.find('tokenizers').path, ignore_errors=True)

# Re-download the necessary resources
nltk.download('punkt_tab')
# Load necessary NLTK data
# nltk.download('punkt')
nltk.download('stopwords')
nltk.download('brown')
nltk.download('wordnet')

# Load models
summary_model = T5ForConditionalGeneration.from_pretrained('t5-base')
summary_tokenizer = T5Tokenizer.from_pretrained("t5-small", legacy=False)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
summary_model = summary_model.to(device)

question_model = T5ForConditionalGeneration.from_pretrained('ramsrigouthamg/t5_squad_v1')
question_tokenizer = T5Tokenizer.from_pretrained('ramsrigouthamg/t5_squad_v1', legacy=False)
question_model = question_model.to(device)

s2v = Sense2Vec().from_disk(r'C:\Users\Vidha\OneDrive\Desktop\DSA\model_1\bitelearn\myapp\s2v_old')
sentence_transformer_model = SentenceTransformer('msmarco-distilbert-base-v3')

from similarity.normalized_levenshtein import NormalizedLevenshtein

normalized_levenshtein = NormalizedLevenshtein()


# Functions for text processing, summarization, keyword extraction, question generation, etc.
# ... (all the functions you've already defined: postprocesstext, summarizer, etc.)
# Define functions
def postprocesstext(content):
    final = ""
    for sent in sent_tokenize(content):
        sent = sent.capitalize()
        final = final + " " + sent
    return final.strip()


def summarizer(text, model, tokenizer):
    text = "summarize: " + text.strip().replace("\n", " ")
    max_len = 512
    encoding = tokenizer.encode_plus(text, max_length=max_len, pad_to_max_length=False, truncation=True,
                                     return_tensors="pt").to(device)
    input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]
    outs = model.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        early_stopping=True,
        num_beams=3,
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        min_length=150,  # Increased minimum length
        max_length=500  # Increased maximum length
    )
    summary = tokenizer.decode(outs[0], skip_special_tokens=True)
    return postprocesstext(summary)

# def summarizer(text, model, tokenizer):
#     text = "summarize: " + text.strip().replace("\n", " ")
#     max_len = 512
#     encoding = tokenizer.encode_plus(text, max_length=max_len, pad_to_max_length=False, truncation=True,
#                                      return_tensors="pt").to(device)
#     input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]
#
#     # Calculate the desired summary length
#     text_length = len(text.split())  # Number of words in the input text
#     min_summary_length = max(int(text_length * 0.6), 50)  # Minimum length (e.g., at least 50 words)
#     # Set max_summary_length to a very large number (the model's practical token limit will apply)
#     max_summary_length = max(int(text_length * 1.5), 1024)  # Increased factor for maximum length
#
#     outs = model.generate(
#         input_ids=input_ids,
#         attention_mask=attention_mask,
#         early_stopping=True,
#         num_beams=3,
#         num_return_sequences=1,
#         no_repeat_ngram_size=2,
#         min_length=min_summary_length,  # Set minimum length based on the calculated value
#         max_length=max_summary_length  # Set maximum length based on the calculated value
#     )
#     summary = tokenizer.decode(outs[0], skip_special_tokens=True)
#     return postprocesstext(summary)

def get_nouns_multipartite(content):
    out = []
    try:
        extractor = pke.unsupervised.MultipartiteRank()
        extractor.load_document(input=content, language='en')
        pos = {'PROPN', 'NOUN'}
        stoplist = list(string.punctuation) + stopwords.words('english')
        extractor.candidate_selection(pos=pos)
        extractor.candidate_weighting(alpha=1.1, threshold=0.75, method='average')
        keyphrases = extractor.get_n_best(n=20)  # Extract more keyphrases
        out = [val[0] for val in keyphrases]
    except:
        traceback.print_exc()
    return out


def get_keywords(originaltext, summarytext):
    keywords = get_nouns_multipartite(originaltext)
    keyword_processor = KeywordProcessor()
    for keyword in keywords:
        keyword_processor.add_keyword(keyword)
    keywords_found = list(set(keyword_processor.extract_keywords(summarytext)))
    return [keyword for keyword in keywords if keyword in keywords_found][:10]  # Increase keyword extraction


def get_question(context, answer, model, tokenizer):
    text = "context: {} answer: {}".format(context, answer)
    encoding = tokenizer.encode_plus(text, max_length=384, pad_to_max_length=False, truncation=True,
                                     return_tensors="pt").to(device)
    input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]
    outs = model.generate(input_ids=input_ids, attention_mask=attention_mask, early_stopping=True, num_beams=5,
                          num_return_sequences=1, no_repeat_ngram_size=2, max_length=72)
    return tokenizer.decode(outs[0], skip_special_tokens=True).replace("question:", "").strip()


def sense2vec_get_words(word, s2v, topn, question):
    output = []
    try:
        sense = s2v.get_best_sense(word)
        most_similar = s2v.most_similar(sense, n=topn)
        base_sense = sense.split('|')[1]
        output = [eachword[0].split('|')[0].replace("_", " ").title().strip() for eachword in most_similar if
                  eachword[0].split('|')[1] == base_sense]
    except:
        output = []
    return [word for word in output if word.lower() not in question.lower()]


def wordnet_get_synonyms(word):
    synonyms = []
    for syn in wn.synsets(word):
        for lemma in syn.lemmas():
            synonym = lemma.name().replace('_', ' ').title()
            if synonym.lower() != word.lower():
                synonyms.append(synonym)
    return list(OrderedDict.fromkeys(synonyms))


def mmr(doc_embedding, word_embeddings, words, top):
    if not words:
        return []
    scores = cosine_similarity(doc_embedding.reshape(1, -1), word_embeddings).flatten()
    scores = scores / scores.sum()
    mmr_scores = []
    for i in range(len(words)):
        mmr_scores.append((words[i], scores[i]))
    mmr_scores.sort(key=lambda x: x[1], reverse=True)
    return [word for word, score in mmr_scores[:top]]


#     return questions

def generate_questions(text, n=10):  # Default to 10 questions
    summary = summarizer(text, summary_model, summary_tokenizer)
    print("Generated Summary:\n", summary)  # Print the summary
    keywords = get_keywords(text, summary)
    questions = []
    generated_questions = set()  # Track unique questions

    for keyword in keywords:
        question = get_question(summary, keyword, question_model, question_tokenizer)

        # Check for uniqueness of the question
        if question in generated_questions:
            continue

        distractors = sense2vec_get_words(keyword, s2v, 50, question)  # Generate more candidates
        distractors.extend(wordnet_get_synonyms(keyword))  # Add synonyms from WordNet
        distractors = mmr(sentence_transformer_model.encode(question), sentence_transformer_model.encode(distractors),
                          distractors, 3)

        # If distractors are still insufficient, use a fallback approach
        if len(distractors) < 3:
            distractors = wordnet_get_synonyms(keyword)[:3] + sense2vec_get_words(keyword, s2v, 50, question)[:3]

        if len(distractors) < 3:  # If still not enough distractors, continue to the next keyword
            continue

        options = distractors[:3] + [keyword]
        random.shuffle(options)  # Shuffle to randomize the position of the correct answer

        questions.append({"question": question, "options": options, "answer": keyword})
        generated_questions.add(question)  # Add the question to the set of generated questions

        if len(questions) >= n:  # Adjust to stop at 10 questions
            break

    return  summary,questions