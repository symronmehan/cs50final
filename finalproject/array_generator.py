def main():
    file = open('file_name', 'r')

    data = file.read()
    array = []
    array = data.split("\n")
    ','.join(map('"{0}"'.format, array))
    return (array)

if __name__ == "__main__":
	main()