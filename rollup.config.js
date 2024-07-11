import codegen from 'rollup-plugin-codegen';
import deckyPlugin from "@decky/rollup";

export default deckyPlugin({
  plugins: [
    codegen(),
  ],
});
