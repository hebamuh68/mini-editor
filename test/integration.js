#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running integration tests...\n');

// Test 1: Check if all required files exist in dist/
function testDistFiles() {
  console.log('📁 Testing dist/ files...');
  
  const requiredFiles = [
    'dist/mini-editor.es.js',
    'dist/mini-editor.umd.js',
    'dist/style.css'
  ];
  
  const missingFiles = [];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles);
    process.exit(1);
  }
  
  console.log('✅ All required files exist');
}

// Test 2: Check package.json exports
function testPackageExports() {
  console.log('\n📦 Testing package.json exports...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check if exports field exists
  if (!packageJson.exports) {
    console.error('❌ Missing exports field in package.json');
    process.exit(1);
  }
  
  // Check main export
  if (!packageJson.exports['.']) {
    console.error('❌ Missing main export in package.json');
    process.exit(1);
  }
  
  // Check CSS export
  if (!packageJson.exports['./dist/style.css']) {
    console.error('❌ Missing CSS export in package.json');
    process.exit(1);
  }
  
  console.log('✅ Package.json exports are correctly configured');
}

// Test 3: Check if files can be imported (basic syntax check)
function testImportSyntax() {
  console.log('\n📥 Testing import syntax...');
  
  try {
    // Test ES module syntax
    const esModule = fs.readFileSync('dist/mini-editor.es.js', 'utf8');
    if (!esModule.includes('export')) {
      throw new Error('ES module does not contain exports');
    }
    
    // Test UMD syntax
    const umdModule = fs.readFileSync('dist/mini-editor.umd.js', 'utf8');
    if (!umdModule.includes('(function (global, factory)') && !umdModule.includes('define(')) {
      throw new Error('UMD module format is incorrect');
    }
    
    console.log('✅ Import syntax is valid');
  } catch (error) {
    console.error('❌ Import syntax error:', error.message);
    process.exit(1);
  }
}

// Test 4: Check CSS file content
function testCSSFile() {
  console.log('\n🎨 Testing CSS file...');
  
  try {
    const css = fs.readFileSync('dist/style.css', 'utf8');
    
    if (css.trim().length === 0) {
      throw new Error('CSS file is empty');
    }
    
    // Check for basic CSS syntax
    if (!css.includes('{') || !css.includes('}')) {
      throw new Error('CSS file does not contain valid CSS syntax');
    }
    
    console.log('✅ CSS file is valid');
  } catch (error) {
    console.error('❌ CSS file error:', error.message);
    process.exit(1);
  }
}

// Test 5: Check types field
function testTypesField() {
  console.log('\n📝 Testing types field...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.types) {
    console.error('❌ Missing types field in package.json');
    process.exit(1);
  }
  
  const typesPath = packageJson.types;
  
  if (!fs.existsSync(typesPath)) {
    console.error(`❌ Types file does not exist: ${typesPath}`);
    process.exit(1);
  }
  
  console.log('✅ Types field is correctly configured');
}

// Test 6: Check files field includes all necessary files
function testFilesField() {
  console.log('\n📋 Testing files field...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.files || !Array.isArray(packageJson.files)) {
    console.error('❌ Missing or invalid files field in package.json');
    process.exit(1);
  }
  
  const requiredInclusions = ['dist', 'src'];
  const missingInclusions = requiredInclusions.filter(item => !packageJson.files.includes(item));
  
  if (missingInclusions.length > 0) {
    console.error('❌ Missing required entries in files field:', missingInclusions);
    process.exit(1);
  }
  
  console.log('✅ Files field includes all necessary directories');
}

// Run all tests
function runAllTests() {
  try {
    testDistFiles();
    testPackageExports();
    testImportSyntax();
    testCSSFile();
    testTypesField();
    testFilesField();
    
    console.log('\n🎉 All integration tests passed!');
    console.log('✅ Package is ready for publishing');
  } catch (error) {
    console.error('\n💥 Integration test failed:', error.message);
    process.exit(1);
  }
}

runAllTests(); 