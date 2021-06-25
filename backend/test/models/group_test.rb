# frozen_string_literal: true

require 'test_helper'

class GroupTest < ActiveSupport::TestCase
  test 'should not save group without name' do
    group = Group.new(logo: 'TestLogo')
    assert_not group.save, 'Group not saved'
  end

  test 'should save group without logo' do
    group = Group.new(name: 'TestName')
    assert group.save, 'Group saved'
  end
end
