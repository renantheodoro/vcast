# vcast

## Project setup
```
npm config set @voxel:registry https://www.myget.org/F/voxeldigital/npm/
npm login --registry https://www.myget.org/F/voxeldigital/npm/ --scope=@voxel
npm config set always-auth true --registry https://www.myget.org/F/voxeldigital/npm/
npm install
```

### Compiles and hot-reloads for development - tablet
```
npm run serve-t
```

### Compiles and hot-reloads for development - smartphone
```
npm run serve-s
```

### Compiles and minifies for production - tablet
```
npm run build-t
```

### Compiles and minifies for production - smartphone
```
npm run build-s
```