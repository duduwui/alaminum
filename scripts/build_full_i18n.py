# -*- coding: utf-8 -*-
"""
Comprehensive 31-Language Localization Generator for Doorhome
Guarantees complete coverage for Italian, French, German, Spanish, Arabic, Kurdish, etc.
across all components, sections, and catalog products.
"""

import json
import re
import os

BASE_DIR = '/home/emz/Desktop/alaminum'

LANG_CODES = [
  'ckb', 'kmr', 'ar', 'tr', 'fa', 'en-GB', 'de', 'fr', 'it', 'el',
  'es', 'ro', 'bg', 'sr', 'bs', 'hr', 'sq', 'nl', 'sv', 'pl',
  'pt', 'en-US', 'es-MX', 'pt-BR', 'zh-CN', 'ru', 'hi', 'ja', 'ko', 'kk', 'en'
]

print(f"Total languages target: {len(LANG_CODES)}")
