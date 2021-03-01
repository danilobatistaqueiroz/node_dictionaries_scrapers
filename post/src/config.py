from configparser import ConfigParser
parser = ConfigParser()
parser.read('config.ini')[0]
word_list = parser.get('configurations', 'word_list')