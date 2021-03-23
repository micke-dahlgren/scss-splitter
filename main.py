import re

filepath='./testData/eventModal.js'
scssRefs = []

class Scss:
  def __init__(self, filename, ref, classes=[]):
    self.filename = filename
    self.ref = ref
    self.classes = classes

class relationship:
  def __init__(self, jsFile, scssClasses,scss):
    self.jsFile = jsFile
    self.scssClasses = scssClasses
    self.jsFile = scss



def get_SCSS_filename_from_js(line):
  scssFile = line
  while (scssFile.count('/') != 0):
    scssFile = re.sub(r'^.*?/', '', scssFile)
    
  return scssFile.replace("'","").strip()

def get_SCSS_ref_name_from_js(line):
  result = re.search('import (.*) from', line)
  return (result.group(1))

def get_SCSS_imports_from_JS_file(filepath):
  jsFile = open(filepath, 'r')
  Lines = jsFile.readlines()
  scssDict =	{}

  for line in Lines:
    lineIsScssImport = re.search("scss", line)
    
    if lineIsScssImport:
      scssFile = get_SCSS_filename_from_js(line)
      scssRef = get_SCSS_ref_name_from_js(line)
      scssDict[scssRef] = scssFile
      scssRefs.append(scssRef)
    
    for ref in scssRefs:
      lineContainsScssRef = re.search(ref, line)
      if (lineContainsScssRef):
        className = line
        className = className[className.find(ref):]
        className = className.split(ref + '[' + "\'")
        
        if (len(className) > 1):
          className = className[1].split("\'", 1)
          # print(ref +' : ' +className[0])

  return scssDict

scssDict = get_SCSS_imports_from_JS_file(filepath)

SCSS_list = [Scss(scssDict[scssRefs[0]], scssRefs[0]), Scss(scssDict[scssRefs[1]], scssRefs[1]), ]


def get_SCSS_classes_from_SCSS(filepath, scss):
  jsFile = open(filepath, 'r')
  Lines = jsFile.readlines()

  fileAsString = ""
  for line in Lines:
    fileAsString += line
  
  depth = 0
  rootClass = ''
  className = ''
  # Get each classname
  for line in Lines:

    # Handle class depth
    lineOpensClass = re.search('\{',line)
    lineClosesClass = re.search('\}', line)
    if(lineOpensClass):
      depth += 1
    if(lineClosesClass):
      depth -= 1
    if(depth < 0):
      print('---WARNING---: Impossible depth: '+ depth +'in scss file')
    
    # ignore these lines:
    lineIsWebkitSelector = re.search("::-webkit",line)
    lineIsDeclarative = re.search(":",line)
    lineIsExtension = re.search("@",line)
    if(lineIsWebkitSelector or lineIsDeclarative or lineIsExtension):
      continue

    # parse classNames
    lineIsClass = re.search(r"(.*)\{", line)
    if(lineIsClass):
      className = lineIsClass.group(1)
      className = className.replace(" ","")
      if(depth == 1):
        className = className.replace(".","")
        rootClass = className
      elif (depth > 1):
        if re.search('&', className): 
          className = className.replace("&.","").strip()
          className = className.replace("&-","").strip()
          className = rootClass + '-' + className
        else:
          #pure div selector - ignore
          continue
      
      scss.classes.append(className)


  print(scss.classes)  

scssfp='./testData/Button.module.scss'

get_SCSS_classes_from_SCSS(scssfp, SCSS_list[1])