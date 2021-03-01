import shutil
import os

""" Move all mp3 files from backup to anki media folder """


word_list = '4001-5000'

path1 = '/home/element/Documents/english/anki-files/mostcommon-40000/mp3'
path2 = '/home/element/tutorials/puppeteer/mp3'

destine = '/home/element/snap/anki-woodrow/27/.local/share/Anki2/User 1/collection.media'

os.makedirs(destine+'/'+word_list, exist_ok=True)

shutil.copytree(path1+'/'+word_list, destine+'/'+word_list+'/thesaurus')

shutil.copytree(path2+'/'+word_list+'/cambridge', destine+'/'+word_list+'/cambridge')

shutil.copytree(path2+'/'+word_list+'/howjsay', destine+'/'+word_list+'/howjsay')