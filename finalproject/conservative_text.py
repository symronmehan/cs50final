def main():
    file = open('conservative_text', 'r')

    data = file.read()
    array = []
    array = data.split("\n")
    ','.join(map('"{0}"'.format, array))
    return (array_conservative)

if __name__ == "__main__":
	main()