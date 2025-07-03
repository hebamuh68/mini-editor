#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Running consumer simulation tests...\n');

// Simulate different import scenarios
function testImportScenarios() {
  console.log('📥 Testing import scenarios...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Test 1: Check if main field points to existing file
  if (packageJson.main) {
    if (!fs.existsSync(packageJson.main)) {
      console.error(`❌ Main field points to non-existent file: ${packageJson.main}`);
      process.exit(1);
    }
    console.log('✅ Main field is valid');
  }
  
  // Test 2: Check if module field points to existing file
  if (packageJson.module) {
    if (!fs.existsSync(packageJson.module)) {
      console.error(`❌ Module field points to non-existent file: ${packageJson.module}`);
      process.exit(1);
    }
    console.log('✅ Module field is valid');
  }
  
  // Test 3: Check if style field points to existing file
  if (packageJson.style) {
    if (!fs.existsSync(packageJson.style)) {
      console.error(`❌ Style field points to non-existent file: ${packageJson.style}`);
      process.exit(1);
    }
    console.log('✅ Style field is valid');
  }
  
  // Test 4: Check exports field paths
  if (packageJson.exports) {
    for (const [key, value] of Object.entries(packageJson.exports)) {
      if (typeof value === 'string') {
        if (!fs.existsSync(value)) {
          console.error(`❌ Export path does not exist: ${key} -> ${value}`);
          process.exit(1);
        }
      } else if (typeof value === 'object') {
        for (const [condition, path] of Object.entries(value)) {
          if (!fs.existsSync(path)) {
            console.error(`❌ Export path does not exist: ${key} (${condition}) -> ${path}`);
            process.exit(1);
          }
        }
      }
    }
    console.log('✅ All export paths are valid');
  }
}

// Test CSS import simulation
function testCSSImportSimulation() {
  console.log('\n🎨 Testing CSS import simulation...');
  
  try {
    // Simulate importing CSS file
    const cssPath = 'dist/style.css';
    const css = fs.readFileSync(cssPath, 'utf8');
    
    // Check if CSS contains expected content
    const expectedSelectors = [
      '.editor-area',
      '.resizable-image-wrapper',
      '.resize-handle'
    ];
    
    const missingSelectors = expectedSelectors.filter(selector => !css.includes(selector));
    
    if (missingSelectors.length > 0) {
      console.warn('⚠️  CSS missing expected selectors:', missingSelectors);
    } else {
      console.log('✅ CSS contains expected selectors');
    }
    
    // Check for common CSS issues
    if (css.includes('undefined') || css.includes('null')) {
      console.warn('⚠️  CSS contains undefined/null values');
    }
    
    console.log('✅ CSS import simulation passed');
  } catch (error) {
    console.error('❌ CSS import simulation failed:', error.message);
    process.exit(1);
  }
}

// Test module format compatibility
function testModuleCompatibility() {
  console.log('\n📦 Testing module compatibility...');
  
  try {
    // Test ES module
    const esModule = fs.readFileSync('dist/mini-editor.es.js', 'utf8');
    
    // Check for ES module syntax
    if (!esModule.includes('export')) {
      throw new Error('ES module missing export statements');
    }
    
    // Check for Vue component registration
    if (!esModule.includes('MiniEditor') || !esModule.includes('install')) {
      console.warn('⚠️  ES module may not contain proper Vue component registration');
    }
    
    // Test UMD module
    const umdModule = fs.readFileSync('dist/mini-editor.umd.js', 'utf8');
    
    // Check for UMD wrapper
    if (!umdModule.includes('(function') && !umdModule.includes('define(')) {
      throw new Error('UMD module missing proper wrapper');
    }
    
    console.log('✅ Module compatibility tests passed');
  } catch (error) {
    console.error('❌ Module compatibility test failed:', error.message);
    process.exit(1);
  }
}

// Test package size and performance
function testPackageSize() {
  console.log('\n📊 Testing package size...');
  
  try {
    const stats = fs.statSync('dist/mini-editor.es.js');
    const sizeInKB = Math.round(stats.size / 1024);
    
    console.log(`📦 ES module size: ${sizeInKB}KB`);
    
    if (sizeInKB > 500) {
      console.warn('⚠️  ES module is quite large, consider optimization');
    }
    
    const cssStats = fs.statSync('dist/style.css');
    const cssSizeInKB = Math.round(cssStats.size / 1024);
    
    console.log(`🎨 CSS size: ${cssSizeInKB}KB`);
    
    if (cssSizeInKB > 50) {
      console.warn('⚠️  CSS file is quite large, consider optimization');
    }
    
    console.log('✅ Package size tests passed');
  } catch (error) {
    console.error('❌ Package size test failed:', error.message);
    process.exit(1);
  }
}

// Test for common build issues
function testBuildIssues() {
  console.log('\n🔧 Testing for common build issues...');
  
  try {
    const esModule = fs.readFileSync('dist/mini-editor.es.js', 'utf8');
    const umdModule = fs.readFileSync('dist/mini-editor.umd.js', 'utf8');
    
    // Check for source map references (should be removed in production)
    if (esModule.includes('sourceMappingURL') || umdModule.includes('sourceMappingURL')) {
      console.warn('⚠️  Source map references found in production build');
    }
    
    // Check for development-only code
    if (esModule.includes('console.log') || umdModule.includes('console.log')) {
      console.warn('⚠️  Console.log statements found in production build');
    }
    
    // Check for Vue devtools
    if (esModule.includes('__VUE_DEVTOOLS_GLOBAL_HOOK__') || umdModule.includes('__VUE_DEVTOOLS_GLOBAL_HOOK__')) {
      console.warn('⚠️  Vue devtools references found in production build');
    }
    
    console.log('✅ Build issue tests passed');
  } catch (error) {
    console.error('❌ Build issue test failed:', error.message);
    process.exit(1);
  }
}

// Run all consumer simulation tests
function runConsumerSimulationTests() {
  try {
    testImportScenarios();
    testCSSImportSimulation();
    testModuleCompatibility();
    testPackageSize();
    testBuildIssues();
    
    console.log('\n🎉 All consumer simulation tests passed!');
    console.log('✅ Package should work correctly in consumer projects');
  } catch (error) {
    console.error('\n💥 Consumer simulation test failed:', error.message);
    process.exit(1);
  }
}

runConsumerSimulationTests(); 