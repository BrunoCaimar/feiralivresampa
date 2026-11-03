import geopandas as gpd

# 1. Load your original GeoJSON file
input_file = "sample-sirgas.geojson"
gdf = gpd.read_file(input_file)

print(f"Original CRS: {gdf.crs}")

# 2. Define the source CRS if the file doesn't explicitly declare it
# (Replace 31983 with the actual EPSG code of your source data. 
# 31983 is SIRGAS 2000 / UTM zone 23S, common in São Paulo).
if gdf.crs is None:
    print("No CRS found in file. Setting source CRS manually...")
    gdf.set_crs(epsg=31983, inplace=True)

# 3. Reproject the data to WGS84 (EPSG:4326)
print("Converting to WGS84...")
gdf_wgs84 = gdf.to_crs(epsg=4326)

# 4. Save the result to a new file for MapLibre
output_file = "sample.geojson"
gdf_wgs84.to_file(output_file, driver="GeoJSON")

print(f"Success! Saved standard WGS84 data to {output_file}")