import sys
import json
import os

sql_insert: str = """INSERT INTO "locationInfos" (area, city, country, state, "stateShort", zip, location) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', ST_GeogFromText('SRID=4326;POINT({6} {7})'));\n"""

if __name__ == "__main__":
    files = os.listdir(os.getcwd())

    for filename in files:
        if filename.split(".")[1:][0] == "txt":
            count = 0
            data = []
            with open(filename, "r") as file:
                line = file.readline()

                while line:
                    lineData = line.split("\t")

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

            with open(filename.split(".")[0] + ".sql", "w") as file:
                for entry in data:
                    file.write(sql_insert.format(entry["area"],
                                                 entry["city"],
                                                 entry["country"],
                                                 entry["state"],
                                                 entry["stateShort"],
                                                 entry["zip"],
                                                 entry["latitude"],
                                                 entry["longitude"]))

            with open(filename.split(".")[0] + ".json", "w") as file:
                jsonData = json.dumps(
                    {"local_infos": data}, indent=2, sort_keys=True, ensure_ascii=False)

                file.write(jsonData)

                print("{} -> {} & {}: {} entries".format(filename,
                                                         filename.split(".")[0] + ".json", filename.split(".")[0] + ".sql", count))

            os.system(
                "docker cp {} postgis-nexd:/".format(filename.split(".")[0] + ".sql"))

            os.system("docker exec -it postgis-nexd psql -U username -d dbname -f {}".format(
                filename.split(".")[0] + ".sql"))
