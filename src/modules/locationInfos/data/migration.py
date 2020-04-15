import sys
import json
import os

sql_insert: str = """INSERT INTO "locationInfos" (area, city, country, state, "stateShort", zip, location) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', ST_GeogFromText('SRID=4326;POINT({6} {7})'));\n"""
data_path: str = os.getcwd() + "/src/modules/locationInfos/data/"


if __name__ == "__main__":
    files = os.listdir(data_path)

    for filename in files:
        if filename.split(".")[1:][0] == "txt":
            count: int = 0
            data = []
            with open(data_path + filename, "r") as file:
                line = file.readline()

                while line:
                    lineData: str = line.split("\t")

                    data.append({
                        "country": lineData[0],
                        "zip": lineData[1],
                        "city": lineData[2],
                        "state": lineData[3],
                        "stateShort": lineData[4],
                        "area": lineData[7],
                        "latitude": float(lineData[9]),
                        "longitude": float(lineData[10])
                    })

                    count = count + 1
                    line = file.readline()

            with open(data_path + filename.split(".")[0] + ".sql", "w") as file:
                for entry in data:
                    file.write(sql_insert.format(entry["area"],
                                                 entry["city"],
                                                 entry["country"],
                                                 entry["state"],
                                                 entry["stateShort"],
                                                 entry["zip"],
                                                 entry["latitude"],
                                                 entry["longitude"]))

            with open(data_path + filename.split(".")[0] + ".json", "w") as file:
                jsonData: str = json.dumps(
                    {"local_infos": data}, indent=2, sort_keys=True, ensure_ascii=False)

                file.write(jsonData)

                print("{} -> {} & {}: {} entries".format(filename,
                                                         filename.split(".")[0] + ".json", filename.split(".")[0] + ".sql", count))

            os.system(
                "docker cp {} postgis-nexd:/".format(data_path + filename.split(".")[0] + ".sql"))

            os.system("docker exec -it postgis-nexd psql -U username -d dbname -f {} > /dev/null".format(
                filename.split(".")[0] + ".sql"))
