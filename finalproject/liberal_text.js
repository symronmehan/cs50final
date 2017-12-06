def main():
    file = open('liberal_text', 'r')

    data = file.read()
    array = []
    array = data.split("\n")
    ','.join(map('"{0}"'.format, array))
    return (array)

if __name__ == "__main__":
	main()